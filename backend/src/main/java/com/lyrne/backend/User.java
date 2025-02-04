package com.lyrne.backend;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class User {

    private static Gson GSON = new Gson();

    enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR, ADMIN }

    // All users
    // TODO: I think uuids are not the play tbh
    private final UUID id;
    private Role role;
    private DateTime created;
    private DateTime lastLogin;

    private String username;
    private String email;
    private String phone;
    private String icon; // this can just be a base64 encoded png or some shit

    // Tutors
    // TODO: idk if this is the best way to store availability, but it seems simple enough??
    private final ArrayList<Interval> availability = new ArrayList<>();

    public JsonObject asJson() {
        return GSON.toJsonTree(this).getAsJsonObject();
    }

    @Override
    public String toString() {
        return asJson().toString();
    }
}
