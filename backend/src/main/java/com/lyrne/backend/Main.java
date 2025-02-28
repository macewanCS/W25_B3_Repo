package com.lyrne.backend;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.lyrne.backend.User.Role;
import com.lyrne.backend.services.AuthManager;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.FakeUsers;
import com.lyrne.backend.services.SendEmail;

import io.javalin.Javalin;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.impl.config.NonMinecraft;

import java.nio.file.Path;
import java.util.Optional;

import org.joda.time.DateTime;

public class Main {

    public static final Gson GSON = new Gson();

    public static void main(String[] args) {
        NonMinecraft.init(Path.of("./lyrne/config"), Path.of("./lyrne/db"));
        AuthManager.registerProvider("https://appleid.apple.com/auth/keys");

        FakeUsers.create(250); // create 250 fake users

        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
        })
                // Make sure every body is authenticated
                .before("/api/private/*", AuthManager::authenticate)

                // Handle fetching user data
                .get("/api/private/user", ctx -> Optional.ofNullable(ctx.sessionAttribute("user"))
                        .ifPresent(user -> ctx.result(user.toString())), User.Role.ANYONE)

                // Handle updating user data
                .post("/api/private/user", ctx -> Optional.ofNullable(ctx.sessionAttribute("user")).ifPresent(user -> {
                    ((User) user).update(JsonParser.parseString(ctx.body()).getAsJsonObject());
                    DatabaseManager.saveUser(((User) user));
                    ctx.result(user.toString());
                }))

                // Handle fetching list of tutors
                .get("/api/private/tutors", ctx -> {
                    int amount = Optional.ofNullable(ctx.queryParam("amount")).map(Integer::parseInt).orElse(25);

                    JsonArray tutors = new JsonArray();
                    DatabaseManager.getTutors(amount).forEach(user -> tutors.add(user.asJson()));
                    System.out.println(tutors);
                    ctx.result(tutors.toString());
                })

                // Save user data if it was changed in the current session
                .after("/api/private/*", ctx -> {
                    Optional.ofNullable(ctx.sessionAttribute("user")).ifPresent(user -> {
                        if (((User) user).isDirty()) DatabaseManager.saveUser((User) user);
                    });
                })

                .start(8820);
    /* --------- testing db stuff, uncomment it if you wanna look
        String name = new String("l3n4jj6");
        DateTime s1 = new DateTime(2025, 3, 20, 5, 0);
        DateTime s2 = new DateTime(2026, 3, 20, 5, 0);
        DateTime s3 = new DateTime(2026, 3, 20, 5, 0);
        DateTime e1 = new DateTime(2025, 3, 20, 6, 0);
        DateTime e2 = new DateTime(2026, 3, 20, 6, 0);
        DateTime e3 = new DateTime(2026, 3, 20, 6, 0);
        TimeSlot mts1 = new TimeSlot(s1, e1, name);
        String ID = mts1.id;

        mts1.addSubject(0); // math
        mts1.addSubject(3); // english
        TimeSlot mts2 = new TimeSlot(s2, e2, "name");
        mts2.addSubject(0); // math
        mts2.addSubject(3); // biology
        TimeSlot mts3 = new TimeSlot(s3, e3, "abcdefg");
        mts3.addSubject(1); // Science
        //DatabaseManager.saveTimeSlot(mts1);
        //DatabaseManager.saveTimeSlot(mts2);
        //DatabaseManager.saveTimeSlot(mts3);

        System.out.println("\nsearch results:");
        for(TimeSlot ts : DatabaseManager.searchResults(TimeSlot.subjectTypes.MATH)){
            ts.printInfo();
        }
        System.out.println("\nsearch results 2:");
        for(TimeSlot ts : DatabaseManager.searchResults(TimeSlot.subjectTypes.MATH, name)){
            ts.printInfo();
        }
        
    //*/
    // now we test email stuff
    SendEmail tester = new SendEmail();

    }
}
