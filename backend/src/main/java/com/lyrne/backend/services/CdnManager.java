package com.lyrne.backend.services;

import io.javalin.http.Context;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class CdnManager {

    private static final String CDN_URL = "http://localhost:8080";
    private static final HttpClient client = HttpClient.newHttpClient();

    public static void forwardRequest(Context ctx) {
        try {
            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder(URI.create(CDN_URL));
            ctx.headerMap().forEach((key, value) -> {
                if (!key.equals("Authorization")) requestBuilder.header(key, value);
            });
            requestBuilder.method(ctx.method().name(), HttpRequest.BodyPublishers.ofByteArray(ctx.bodyAsBytes()));

            HttpResponse<byte[]> response = client.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofByteArray());
            ctx.status(response.statusCode());
            response.headers().map().forEach((key, values) -> values.forEach(value -> ctx.header(key, value)));
            ctx.result(response.body());
        } catch (Exception e) {
            ctx.status(500).result("CDN error: " + e.getMessage());
        }
    }
}
