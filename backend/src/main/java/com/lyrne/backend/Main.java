package com.lyrne.backend;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.lyrne.backend.services.AuthManager;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.FakeUsers;
import com.lyrne.backend.services.Statistics;

import io.javalin.Javalin;
import me.mrnavastar.sqlib.impl.config.NonMinecraft;

import java.nio.file.Path;
import java.util.Optional;

public class Main {

    public static final Gson GSON = new Gson();

    public static void main(String[] args) {
        NonMinecraft.init(Path.of("./lyrne/config"), Path.of("./lyrne/db"));
        AuthManager.registerProvider("https://appleid.apple.com/auth/keys");
        AuthManager.registerProvider("https://accounts.google.com", "https://www.googleapis.com/oauth2/v3/certs");

        FakeUsers.create(250); // create 250 fake users

        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    it.anyHost(); // data security who
                    // not sure what i'd actually need to do here for production, this was just getting it to work on MY pc 
                });
            });
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

                // Handle fetching statistics
                .get("/api/stats", ctx -> {
                    // should it be public? probably not, but until (if) we get actual admin dashboard auth i had to do it this way
                    Statistics stats = new Statistics(); // also probably doesn't need to be re-generated every time but we don't have a huge database rn so honestly idc theres like a week left i cant be bothered
                    ctx.result(stats.toJson());
                })

                .start(8820);

        
       
    }
}
