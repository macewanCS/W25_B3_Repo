package com.lyrne.backend.services;

import com.lyrne.backend.User;
import me.mrnavastar.sqlib.SQLib;
import me.mrnavastar.sqlib.api.DataStore;
import me.mrnavastar.sqlib.api.database.Database;

import java.util.ArrayList;

public class DatabaseManager {

    private static final Database DB = SQLib.getDatabase();
    // This is an example of how to setup a data store
    private static final DataStore someCoolStore = DB.dataStore("lyrne", "someCoolStore");

    public static User getUser(String id) {

        // get a user by their id, create a new user no user could be found

        return new User(id);
    }

    public static void saveUser(User user) {
        // Save user to db
    }

    public static ArrayList<User> searchUsers(String search) {

        // search for users by some query? idk lol

        return new ArrayList<>();
    }
}
