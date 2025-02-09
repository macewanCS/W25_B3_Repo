package com.lyrne.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.Optional;

@Getter
@Setter
@RequiredArgsConstructor
public class User {

    enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR }

    // All users
    private final String id;
    private Role role = Role.ANYONE;
    private DateTime created;
    private DateTime lastLogin;

    private String username;
    private String email;
    private String phone;
    private String icon; // this can just be a base64 encoded png or some shit
    private String[] subjects; // i figure subjects fits better in the user than in the timeslot. also maybe an ArrayList over an Array? not sure what difference it makes in java

    // TODO: idk if this is the best way to store availability, but it seems simple enough??
    private final ArrayList<Interval> availability = new ArrayList<>();

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
    }

    @Override
    public String toString() {
        return asJson().toString();
    }

    public void store(DataContainer container) {
        container.put(JavaTypes.STRING, "username", this.username);
        container.put(JavaTypes.STRING, "email", this.email);
        container.put(JavaTypes.STRING, "phone", this.phone);
        container.put(JavaTypes.STRING, "icon", this.icon);
        container.put(JavaTypes.INT, "role", this.role.ordinal());
    }

    public void load(DataContainer container) {
        Optional<String> un = container.get(JavaTypes.STRING, "username");
        Optional<String> em = container.get(JavaTypes.STRING, "email");
        Optional<String> ph = container.get(JavaTypes.STRING, "phone");
        Optional<String> ic = container.get(JavaTypes.STRING, "icon");
        Optional<Integer> ro = container.get(JavaTypes.INT, "role");

    }

}
