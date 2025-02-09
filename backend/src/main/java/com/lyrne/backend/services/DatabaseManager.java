package com.lyrne.backend.services;

import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.User;
import me.mrnavastar.sqlib.SQLib;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.DataStore;
import me.mrnavastar.sqlib.api.database.Database;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

import org.joda.time.DateTime;

public class DatabaseManager {

    private static final Database DB = SQLib.getDatabase();
    public static DataStore timeSlotStore = DB.dataStore("lyrne", "TimeSlotStore");
    public static DataStore userStore = DB.dataStore("lyrne", "UserStore");

    // Fake database, remove when setting up real database

    public static User getUser(String id) {
        User user = new User(id);
        // get a user by their id, create a new user no user could be found
        Optional<DataContainer> dc = userStore.getContainer("id", id);
        DataContainer container;
        if (dc.isPresent()) container = dc.get();
        else container = null; // maybe raise error here later
        if (container != null){
            
            user.load(container);  
        }
        return user;
         
    }

    public static void saveUser(User user) {
        DataContainer container = userStore.createContainer();
        user.store(container);

    }

    public static TimeSlot getTimeSlot(String id){ // the timeslot ID is (currently) a concatenation of the DateTime in string format (.toString()) and the tutor user ID 
        
        Optional<DataContainer> dc = timeSlotStore.getContainer("id", id);
        DataContainer container;
        if (dc.isPresent()) container = dc.get();
        else container = null; 
        if (container != null){
            TimeSlot ts = new TimeSlot(container);
            return ts; 
        }
        else throw new NoSuchElementException("No time slot found for id: " + id);
        
    }            

    }

     



}
