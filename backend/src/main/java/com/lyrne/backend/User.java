package com.lyrne.backend;

import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;

@Getter
@RequiredArgsConstructor
public class User {

    enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR, ADMIN }

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

    @Override
    public String toString() {
        return asJson().toString();
    }
}
