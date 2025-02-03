package com.lyrne.backend;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;
import io.javalin.security.RouteRole;

public class Main {

    private static void handleLogin(Context ctx) {

    }

    public static void main(String[] args) {
        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
        })

                .before("/api/private/*", ctx -> {
                    // Verify user is authenticated here
                    // Set user roles with ctx.getRoles().add();
                    throw new UnauthorizedResponse();
                })
                // This handler has no auth, anyone can ping it
                .get("/api/some/fancy/endpoint", ctx -> ctx.result("Hello World"))
                // This handler has auth, must be logged in
                .get("/api/private/some/fancy/endpoint", ctx -> ctx.result("Hello World"), User.Role.ANYONE)
                // This handler has auth, and the user must be admin
                .get("/api/private/some/other/endpoint", ctx -> ctx.result("Hello World"), User.Role.ADMIN)


                .get("/api/login", Main::handleLogin, User.Role.ANYONE)

                .start(8820);
    }
}
