package com.lyrne.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.Setter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

import org.apache.logging.log4j.core.util.ArrayUtils;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Map;

@Getter
@Setter
public class User {

    public enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR, TUTOR_PENDING }

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
    private String[] subjects; // i figure subjects fits better in the user than in the timeslot. also maybe an ArrayList over an Array? not sure what difference it makes in java

    // TODO: idk if this is the best way to store availability, but it seems simple enough??
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

    // Stores all the sessions each Tutor has
    private ArrayList<TimeSlot> sessions = new ArrayList<>();

    // Stores weekly earnings and hours in float variables
    private float weeklyHours = 0;
    private float weeklyEarnings = 0;

    // This function should be called everytime there are session changes
    public void updateHoursAndEarnings() {
        // Reset the values to zero to recalculate would be easy, but take up a lot of time
        weeklyHours = 0;
        weeklyEarnings = 0;
        // We could also try remembering which session it was and remove it that way to save time
        for (TimeSlot session: sessions) {
            weeklyHours += Float.valueOf(session.getEndTime()) - Float.valueOf(session.getStartTime());
            weeklyEarnings+= session.getPrice(); // There should be a value of earnings in each session
        }
    }

    // Cancel a session by inserting the reference to the session
    public void cancelSession(String ID) {
        for (TimeSlot session: sessions) {
            if (ID == session.getID()) {
                sessions.remove(session);
            }
        }
        updateHoursAndEarnings();
    }

    // HashMap for checking which user details are public (true) or private (false)
    public Map<String, Boolean> visibility = Map.ofEntries(
           Map.entry("id", true),
           Map.entry("username", true),
           Map.entry("email", false),
           Map.entry("phone", false),
           Map.entry("role", true)
    );

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

    public void store(DataContainer container) { // lowkey not sure how to best do "subjects" 
        container.put(JavaTypes.STRING, "id", this.id);
        container.put(JavaTypes.STRING, "username", this.username);
        container.put(JavaTypes.STRING, "email", this.email);
        container.put(JavaTypes.STRING, "phone", this.phone);
        container.put(JavaTypes.STRING, "icon", this.icon);
        container.put(JavaTypes.INT, "role", this.role.ordinal());
        if (this.lastLogin != 0) container.put(JavaTypes.LONG, "lastlogin", this.lastLogin);
        if (this.created != 0) container.put(JavaTypes.LONG, "created", this.created);
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
    }
}
