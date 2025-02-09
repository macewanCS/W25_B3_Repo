package com.lyrne.backend.services;

import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.User;
import me.mrnavastar.sqlib.SQLib;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.DataStore;
import me.mrnavastar.sqlib.api.database.Database;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

import org.joda.time.DateTime;

public class DatabaseManager {

    private static final Database DB = SQLib.getDatabase();
    public static DataStore timeSlotStore = DB.dataStore("lyrne", "TimeSlotStore");
    public static DataStore userStore = DB.dataStore("lyrne", "UserStore");

    // Fake database, remove when setting up real database
    private static final ConcurrentHashMap<String, User> fakeDb = new ConcurrentHashMap<>();

    public static User getUser(String id) {

        // get a user by their id, create a new user no user could be found

        return fakeDb.computeIfAbsent(id, k -> new User(id));
    }

    public static void saveUser(User user) {
        // Save user to db

        fakeDb.put(user.getId(), user);
    }

    public static ArrayList<User> searchUsers(String search) {

        // search for users by some query? idk lol

        return new ArrayList<>();
    }

    // testing timeslot db store and retrieval

     



}
