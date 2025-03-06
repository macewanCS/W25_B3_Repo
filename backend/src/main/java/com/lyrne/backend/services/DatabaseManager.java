package com.lyrne.backend.services;

import com.lyrne.backend.Main;
import com.lyrne.backend.User;
import me.mrnavastar.sqlib.SQLib;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.DataStore;
import me.mrnavastar.sqlib.api.database.Database;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.List;

import java.util.Optional;

public class DatabaseManager {

    private static final Database DB = SQLib.getDatabase();
    //public static DataStore timeSlotStore = DB.dataStore("lyrne", "TimeSlotStore");
    public static DataStore tutorStore = DB.dataStore("lyrne", "TutorStore");
    public static DataStore userStore = DB.dataStore("lyrne", "UserStore");

    public static User getUser(String id) {
        User user = new User(id);
        Optional<DataContainer> container = tutorStore.getContainer("id", id);
        if (container.isEmpty()) container = userStore.getContainer("id", id);
        container.ifPresentOrElse(user::load, () -> {
            // when it creates a new user, it can't send an email as no address has been attached, so this line is useless atm
            SendEmail.sendWelcome(user);
        });
        return user;
    }

    public static void saveUser(User user) {
        DataStore store = User.Role.TUTOR.equals(user.getRole()) ? tutorStore : userStore;
        user.store(store.getOrCreateContainer("id", user.getId()));
    }

    public static ArrayList<User> getTutors(int offset, Main.Subject subject, ArrayList<Interval> availability) {
        ArrayList<User> query = new ArrayList<>();
        List<DataContainer> containers = tutorStore.getContainers("subject_" + subject.toString().toLowerCase(), true);

        for (int i = offset; query.size() < 10 && i < containers.size(); i++) {
            User tutor = new User(containers.get(i));
            if (tutor.getAvailability().stream()
                    .anyMatch(tutorAvail -> availability.stream()
                            .anyMatch(tutorAvail::overlaps))) query.add(tutor);
        }
        return query;
    }

    /*public static TimeSlot getTimeSlot(String id){ // the timeslot ID is (currently) a concatenation of the DateTime in string format (.toString()) and the tutor user ID
        
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
    
    public static void saveTimeSlot(TimeSlot timeslot){
        DataContainer container = timeSlotStore.createContainer();
        timeslot.store(container);
    }*/
}
