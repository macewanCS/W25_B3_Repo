package com.lyrne.backend;

import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class Database {

    private static final ConcurrentHashMap<UUID, User> fakeDatabase = new ConcurrentHashMap<>();

    public static User getUser(UUID uuid) {
        return fakeDatabase.computeIfAbsent(uuid, User::new);
    }

    public static void saveUser(User user) {
        fakeDatabase.put(user.getId(), user);
    }

    public static ArrayList<User> searchUsers(String search) {
        return new ArrayList<>();
    }
}
