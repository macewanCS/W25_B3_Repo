package com.lyrne.backend.services;

import com.auth0.jwk.*;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.lyrne.backend.User;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;
import lombok.SneakyThrows;
import org.joda.time.DateTime;

import java.net.URI;
import java.net.URL;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class AuthManager {

    private static final ConcurrentHashMap<String, JwkProvider> providers = new ConcurrentHashMap<>();

    @SneakyThrows
    public static void registerProvider(String key, String url) {
        JwkProvider jwkProvider = new GuavaCachedJwkProvider(new UrlJwkProvider(new URI(url).toURL()), 10, Duration.ofSeconds(TimeUnit.HOURS.toSeconds(24)));

        if (key == null) {
            URL providerUrl = new URI(url).toURL();
            key = providerUrl.getProtocol() + "://" + providerUrl.getHost();
        }
        providers.put(key, jwkProvider);
    }

    public static void registerProvider(String url) {
        registerProvider(null, url);
    }

    @SneakyThrows
    public static void authenticate(Context ctx) {
        String token = ctx.header("Authorization");
        if (token == null) throw new UnauthorizedResponse();

        try {
            DecodedJWT jwt = JWT.decode(token.replace("Bearer ", ""));
            Optional<JwkProvider> provider = Optional.ofNullable(providers.get(jwt.getIssuer()));
            if (provider.isEmpty()) throw new UnauthorizedResponse();

            PublicKey key = provider.get().get(jwt.getKeyId()).getPublicKey();
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) key);
            JWTVerifier verifier = JWT.require(algorithm).build();

            try {
                verifier.verify(jwt);
            } catch (Exception e) {
                throw new UnauthorizedResponse();
            }

            User user = DatabaseManager.getUser(jwt.getSubject());
            user.setEmail(jwt.getClaim("email").asString());
            user.setLastLogin(new DateTime().getMillis());
            ctx.sessionAttribute("user", user);
            ctx.sessionAttribute("jwt", jwt);

            if (user.getIcon() == null) {
                user.setIcon(jwt.getClaim("picture").asString());
            }

        } catch (JWTDecodeException e) {
            System.out.println("failed to decode JWT");
            System.out.println("TOKEN: " + token);
        }
    }
}
