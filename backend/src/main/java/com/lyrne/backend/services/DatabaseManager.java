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
    static DataStore timeSlotStore = DB.dataStore("lyrne", "TimeSlotStore");
    static DataStore userStore = DB.dataStore("lyrne", "UserStore");

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

     public static void main(String[] args){
        //------------------- Testing block!
        DateTime start = new DateTime(2025, 2, 20, 1, 0);
        DateTime end = new DateTime(2025, 2, 20, 3, 0);
        String name = new String("Dr Tutor");
        TimeSlot mts1 = new TimeSlot(start, end, name);

        DataContainer testContainer = timeSlotStore.createContainer();
        
        mts1.store(testContainer);

        TimeSlot mts2 = new TimeSlot(testContainer);
        System.out.println("Retrieved Timeslot: ");
        mts2.printInfo();
        



        //-------------------
    }



}
