package com.lyrne.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;

@Getter
@Setter
@RequiredArgsConstructor
public class User {

    public enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR }

    private transient boolean dirty = false; // Don't save this to database - is used to mark whether this user is out of sync with db

    // All users
    private final String id;
    private Role role = Role.ANYONE;
    private DateTime created;
    private DateTime lastLogin;

    private String username;
    private String email;
    private String phone;
    private String icon; // this can just be a base64 encoded png or some shit

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
        this.dirty = true;
    }

    @Override
    public String toString() {
        return asJson().toString();
    }
}
