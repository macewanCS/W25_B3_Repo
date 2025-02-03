package com.lyrne.backend;

import com.google.gson.Gson;
import io.javalin.Javalin;

public class Main {

    public static final Gson GSON = new Gson();

    public static void main(String[] args) {
        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
        })
                .before("/api/private/*", AuthManager::authenticate)

                // This handler has no auth, anyone can ping it
                .get("/api/some/fancy/endpoint", ctx -> ctx.result("Hello World"))
                // This handler has auth, must be logged in
                .get("/api/private/some/fancy/endpoint", ctx -> ctx.result("Hello World"), User.Role.ANYONE)
                // This handler has auth, and the user must be admin
                .get("/api/private/some/other/endpoint", ctx -> ctx.result("Hello World"), User.Role.ADMIN)

                .start(8820);
    }
}
