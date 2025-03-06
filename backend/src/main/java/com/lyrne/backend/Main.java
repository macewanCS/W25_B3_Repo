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
    }
    
}
