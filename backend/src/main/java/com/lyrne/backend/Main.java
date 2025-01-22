package com.lyrne.backend;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;

public class Main {

    public static void main(String[] args) {
        Javalin.create(config -> {
            config.bundledPlugins.enableRouteOverview("/");
            config.staticFiles.add("web");
        })

                .before("/api/private/*", ctx -> {
                    // Verify user is authenticated here
                    throw new UnauthorizedResponse();
                })
                // This handler has no auth, anyone can ping it
                .get("/api/some/fancy/endpoint", ctx -> ctx.result("Hello World"))
                // This handler has auth, must be logged in
                .get("/api/private/some/fancy/endpoint", ctx -> ctx.result("Hello World"))

                .start(8820);
    }
}
