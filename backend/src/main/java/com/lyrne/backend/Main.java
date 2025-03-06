package com.lyrne.backend;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.lyrne.backend.services.AuthManager;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.FakeUsers;
import io.javalin.Javalin;
import me.mrnavastar.sqlib.impl.config.NonMinecraft;

import java.nio.file.Path;
import java.util.Optional;

public class Main {

    public static final Gson GSON = new Gson();

    public enum Subject {
        MATH,
        CHEMISTRY,
        PHYSICS,
        BIOLOGY,
        ENGLISH,
        SOCIAL
    }

    public static void main(String[] args) {
        NonMinecraft.init(Path.of("./lyrne/config"), Path.of("./lyrne/db"));
        AuthManager.registerProvider("https://appleid.apple.com/auth/keys");

        FakeUsers.create(250); // create 250 fake users

        String emailToken = System.getenv("emailtoken"); // email token

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
                    String subject = Optional.ofNullable(ctx.queryParam("subject")).orElse("");
                    int offset = Optional.ofNullable(ctx.queryParam("offset")).map(Integer::parseInt).orElse(0);

                    Optional.ofNullable(ctx.sessionAttribute("user")).ifPresent(user -> {
                        JsonArray tutors = new JsonArray();
                        DatabaseManager.getTutors(offset, Main.Subject.valueOf(subject.toUpperCase()), ((User) user).getAvailability()).forEach(tutor -> tutors.add(tutor.asJson()));
                        ctx.result(tutors.toString());
                    });
                })

                // Save user data if it was changed in the current session
                .after("/api/private/*", ctx -> {
                    Optional.ofNullable(ctx.sessionAttribute("user")).ifPresent(user -> {
                        if (((User) user).isDirty()) DatabaseManager.saveUser((User) user);
                    });
                })

                .start(8820);
    }
    //test
    User user = DatabaseManager.getUser("fortnite");
}
