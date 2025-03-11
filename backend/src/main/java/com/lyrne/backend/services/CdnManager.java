package com.lyrne.backend.services;

import io.javalin.http.Context;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class CdnManager {

    private static final String CDN_URL = "http://localhost:8080";
    private static final HttpClient client = HttpClient.newHttpClient();

    public static void forwardRequest(Context ctx) {
        try {
            String path = ctx.path().replaceFirst("/proxy", ""); // Adjust path for forwarding
            URI targetUri = URI.create(CDN_URL + path);

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder(targetUri).method(ctx.method().toString(), getRequestBody(ctx));
            ctx.headerMap().forEach(requestBuilder::header);

            HttpResponse<byte[]> response = client.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofByteArray());

            ctx.status(response.statusCode());
            response.headers().map().forEach((key, values) -> values.forEach(value -> ctx.header(key, value)));
            ctx.result(response.body());
        } catch (Exception e) {
            ctx.status(500).result("CDN error: " + e.getMessage());
        }
    }

    private static HttpRequest.BodyPublisher getRequestBody(Context ctx) {
        if (ctx.body().isEmpty()) return HttpRequest.BodyPublishers.noBody();
        return HttpRequest.BodyPublishers.ofString(ctx.body());
    }
}
