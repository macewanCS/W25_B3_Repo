package com.lyrne.backend;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

public class Database {

    private static final ConcurrentHashMap<String, User> fakeDatabase = new ConcurrentHashMap<>();

    public static User getUser(String id) {
        return fakeDatabase.computeIfAbsent(id, User::new);
    }

    public static void saveUser(User user) {
        fakeDatabase.put(user.getId(), user);
    }

    public static ArrayList<User> searchUsers(String search) {
        return new ArrayList<>();
    }
}
