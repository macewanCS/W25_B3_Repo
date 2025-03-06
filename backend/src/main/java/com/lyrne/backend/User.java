package com.lyrne.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.Setter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.GsonTypes;
import me.mrnavastar.sqlib.api.types.JavaTypes;

import me.mrnavastar.sqlib.api.types.SQLibType;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.Map;
import java.util.Arrays;

@Getter
@Setter
public class User {

    public enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR, TUTOR_PENDING }
    private TypeToken<ArrayList<Interval>> intervalsType = new TypeToken<>() {};
    private SQLibType<ArrayList<Interval>> INTERVALS = new SQLibType<>(GsonTypes.ELEMENT, Main.GSON::toJsonTree, i -> Main.GSON.fromJson(i, intervalsType));

    public enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR }

    private transient boolean dirty = false; // Don't save this to database - is used to mark whether this user is out of sync with db
    private transient boolean isNew = true;

    // All users
    private transient String id;
    private Role role = Role.ANYONE;
    private long created = 0;
    private long lastLogin = 0;

    private String username;
    private String email;
    private String phone;
    // Icon can be any uri react native supports. link to image, base64 encoded, etc.
    private String icon;

    private ArrayList<Main.Subject> subjects = new ArrayList<>();
    private final ArrayList<Interval> availability = new ArrayList<>();

    public User(String id) {
        this.id = id;
    }

    public User(DataContainer container) {
        container.get(JavaTypes.STRING, "id").ifPresent(id -> {
            this.id = id;
            this.load(container);
        });
    }

    /*// Stores all the sessions each Tutor has
    private ArrayList<TimeSlot> sessions = new ArrayList<>();

    // Stores weekly earnings and hours in float variables
    private float weeklyHours = 0;
    private float weeklyEarnings = 0;

    // This function should be called everytime there are session changes
    public void updateHoursAndEarnings() {
        for (TimeSlot session: sessions) {
            weeklyHours++; // There should be a value of time in each session
            weeklyEarnings++; // There should be a value of earnings in each session
        }
    }

    // HashMap for checking which user details are public (true) or private (false)
    Map<String, Boolean> visibility = Map.ofEntries(
           Map.entry("id", true),
           Map.entry("username", true),
           Map.entry("email", false),
           Map.entry("phone", false),
           Map.entry("role", true)
    );*/

    public JsonObject asJson() {
        return Main.GSON.toJsonTree(this).getAsJsonObject();
    }

    public static User fromJson(JsonElement json) {
        return Main.GSON.fromJson(json, User.class);
    }

    public void update(JsonObject json) {
        JsonObject original = this.asJson();
        for (String keys : json.keySet()) {
            JsonElement element = json.get(keys);
            if (element != null) original.add(keys, element);
        }

        User updated = fromJson(original);
        this.role = updated.role;
        this.username = updated.username;
        this.email = updated.email;
        this.phone = updated.phone;
        this.icon = updated.icon;
        this.dirty = true;
    }

    @Override
    public String toString() {
        return asJson().toString();
    }

    public void store(DataContainer container) {
        container.put(JavaTypes.STRING, "id", this.id);
        container.put(JavaTypes.STRING, "username", this.username);
        container.put(JavaTypes.STRING, "email", this.email);
        container.put(JavaTypes.STRING, "phone", this.phone);
        container.put(JavaTypes.STRING, "icon", this.icon);
        container.put(JavaTypes.INT, "role", this.role.ordinal());
        if (this.lastLogin != 0) container.put(JavaTypes.LONG, "lastlogin", this.lastLogin);
        if (this.created != 0) container.put(JavaTypes.LONG, "created", this.created);

        container.put(INTERVALS, "availability", this.availability);
        Arrays.stream(Main.Subject.values()).forEach(subject -> container.put(JavaTypes.BOOL, "subject_" + subject.toString().toLowerCase(), subjects.contains(subject)));
    }

    public void load(DataContainer container) {
        this.isNew = false;

        container.get(JavaTypes.STRING, "username").ifPresent(username -> this.username = username);
        container.get(JavaTypes.STRING, "email").ifPresent(email -> this.email = email);
        container.get(JavaTypes.STRING, "phone").ifPresent(phone -> this.phone = phone);
        container.get(JavaTypes.STRING, "icon").ifPresent(icon -> this.icon = icon);
        container.get(JavaTypes.INT, "role").ifPresent(role -> this.role = Role.values()[role]);
        container.get(JavaTypes.LONG, "lastlogin").ifPresent(lastLogin -> this.lastLogin = lastLogin);
        container.get(JavaTypes.LONG, "created").ifPresentOrElse(created -> this.created = created, () -> this.created = new DateTime().getMillis());

        container.get(INTERVALS, "availability").ifPresent(this.availability::addAll);
        Arrays.stream(Main.Subject.values())
                .forEach(subject -> container.get(JavaTypes.BOOL, "subject_" + subject.toString().toLowerCase())
                        .ifPresent(has -> {
                            if (has) subjects.add(subject);
                        }));
    }
}
