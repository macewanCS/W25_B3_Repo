package com.lyrne.backend;

import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;
import lombok.SneakyThrows;

import java.net.URI;
import java.net.URL;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class AuthManager {

    private static final ConcurrentHashMap<String, JwkProvider> providers = new ConcurrentHashMap<>();

    static {
        registerProvider("https://appleid.apple.com/auth/keys");
    }

    @SneakyThrows
    private static void registerProvider(String url) {
        JwkProvider jwkProvider = new JwkProviderBuilder(url)
                .cached(10, 24, TimeUnit.HOURS)
                .rateLimited(10, 1, TimeUnit.MINUTES)
                .build();

        URL providerUrl = new URI(url).toURL();
        providers.put(providerUrl.getProtocol() + "://" + providerUrl.getHost(), jwkProvider);
    }

    @SneakyThrows
    public static void authenticate(Context ctx) {
        String token = ctx.header("Authorization");
        if (token == null) return;

        DecodedJWT jwt = JWT.decode(token);
        Optional<JwkProvider> provider = Optional.ofNullable(providers.get(jwt.getIssuer()));
        if (provider.isEmpty()) return;

        PublicKey key = provider.get().get(jwt.getKeyId()).getPublicKey();
        Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) key);
        JWTVerifier verifier = JWT.require(algorithm).build();

        try {
            verifier.verify(jwt);
        } catch (Exception e) {
            throw new UnauthorizedResponse();
        }

        User user = Database.getUser(jwt.getSubject());
        ctx.sessionAttribute("user", user);
        ctx.sessionAttribute("jwt", jwt);
        ctx.routeRoles().add(user.getRole());
    }
}
