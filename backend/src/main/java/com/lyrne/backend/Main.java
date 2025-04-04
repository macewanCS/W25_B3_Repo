package com.lyrne.backend;

import com.google.gson.*;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import com.lyrne.backend.services.AuthManager;
import com.lyrne.backend.services.CdnManager;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.FakeUsers;
import com.lyrne.backend.services.Statistics;

import com.lyrne.backend.util.IntervalAdapter;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;
import me.mrnavastar.sqlib.impl.config.NonMinecraft;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;

import org.joda.time.Interval;

public class Main {

    public static final Gson GSON = new GsonBuilder().registerTypeAdapter(Interval.class, new IntervalAdapter()).create();

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
        AuthManager.registerProvider("https://accounts.google.com", "https://www.googleapis.com/oauth2/v3/certs");

        FakeUsers.create(250); // create 250 fake users

        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
            config.bundledPlugins.enableCors(cors -> {
                // data security who
                // not sure what i'd actually need to do here for production, this was just getting it to work on MY pc
                cors.addRule(CorsPluginConfig.CorsRule::anyHost);
            });
        })
                // Make sure every body is authenticated
                .before("/api/private/*", AuthManager::authenticate)

                // Forward all cdn requests to our cdn service
                .get("/api/private/cdn/*", CdnManager::forwardRequest)
                .get("/api/cdn/*", CdnManager::forwardRequest)
                .post("/api/private/cdn/*", CdnManager::forwardRequest)
                .post("/api/cdn/*", CdnManager::forwardRequest)

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

                // Handle fetching statistics
                .get("/api/stats", ctx -> {
                    // should it be public? probably not, but until (if) we get actual admin dashboard auth i had to do it this way
                    Statistics stats = new Statistics(); // also probably doesn't need to be re-generated every time but we don't have a huge database rn so honestly idc theres like a week left i cant be bothered
                    ctx.result(stats.toJson());
                })

                .get("/api/subjects", ctx -> ctx.result(GSON.toJson(Subject.values())))

                .get("/api/tutors/pending", ctx -> {
                    JsonArray tutors = new JsonArray();
                    DatabaseManager.getPendingTutors().forEach(tutor -> tutors.add(tutor.asJson()));
                    ctx.result(tutors.toString());
                })

                .start(8820);
    }
}
