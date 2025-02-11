package com.lyrne.backend;

import com.google.gson.Gson;
import com.google.gson.JsonParser;
import com.lyrne.backend.User.Role;
import com.lyrne.backend.services.AuthManager;
import com.lyrne.backend.services.DatabaseManager;
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
                .post("api/private/user", ctx -> Optional.ofNullable(ctx.sessionAttribute("user")).ifPresent(user -> {
                    ((User) user).update(JsonParser.parseString(ctx.body()).getAsJsonObject());
                    DatabaseManager.saveUser(((User) user));
                    ctx.result(user.toString());
                }))

                .start(8820);

     /* --------- testing db stuff, uncomment it if you wanna look

        DateTime start = new DateTime(2025, 2, 20, 1, 0);
        DateTime end = new DateTime(2025, 2, 20, 3, 0);
        String name = new String("Dr Tutor");
        TimeSlot mts1 = new TimeSlot(start, end, name);

        DatabaseManager.saveTimeSlot(mts1);
       
        TimeSlot mts2 = DatabaseManager.getTimeSlot(mts1.getID());
        System.out.println("Retrieved Timeslot: ");
        mts2.printInfo();

        User user1 = new User("666f72746e697465", "jones5", "jjones@gmail.com", "0702102017");
        User user7 = new User("686f7065", "hope5", "hhope@gmail.com", "1200302023");
        
        user1.role = Role.TUTOR;
        user7.role = Role.STUDENT;
        DatabaseManager.saveUser(user1);
        DatabaseManager.saveUser(user7);

        User user2 = DatabaseManager.getUser("666f72746e697465");
        User user8 = DatabaseManager.getUser("686f7065");
        System.out.println("Retrieved User: ");
        user2.printInfo();
        user8.printInfo();



        //-------------------*/
    }
}
