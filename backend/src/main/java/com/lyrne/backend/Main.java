package com.lyrne.backend;

import com.google.gson.Gson;
import com.lyrne.backend.services.AuthManager;
import io.javalin.Javalin;
import me.mrnavastar.sqlib.impl.config.SQLibConfig;

import java.nio.file.Path;
import java.util.Optional;

public class Main {

    public static final Gson GSON = new Gson();

    public static void main(String[] args) {
        SQLibConfig.setCustomConfigPath(Path.of("./lyrne/config"));
        SQLibConfig.setCustomDefaultDirectory(Path.of("./lyrne/db"));

        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
        })
                // Make sure every body is authenticated
                .before("/api/private/*", AuthManager::authenticate)

                // Handle fetching user data
                .get("/api/private/user", ctx -> Optional.ofNullable(ctx.sessionAttribute("user"))
                        .ifPresent(user -> ctx.result(user.toString())), User.Role.ANYONE)

                .start(8820);
    }
}
