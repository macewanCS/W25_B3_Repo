package com.lyrne.backend.services;

import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.User;
import me.mrnavastar.sqlib.SQLib;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.DataStore;
import me.mrnavastar.sqlib.api.database.Database;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.List;
import org.joda.time.Interval;
import java.util.Optional;

public class DatabaseManager {

    private static final Database DB = SQLib.getDatabase();
    public static DataStore timeSlotStore = DB.dataStore("lyrne", "TimeSlotStore");
    public static DataStore tutorStore = DB.dataStore("lyrne", "TutorStore");
    public static DataStore userStore = DB.dataStore("lyrne", "UserStore");

    public static User getUser(String id) {
        User user = new User(id);
        Optional<DataContainer> container = tutorStore.getContainer("id", id);
        if (container.isEmpty()) container = userStore.getContainer("id", id);
        container.ifPresent(user::load);
        return user;
    }

    public static ArrayList<User> getTutors(int amount) {
        ArrayList<User> query = new ArrayList<>();
        for (DataContainer container : tutorStore.getContainers()) {
            User tutor = new User(container);
            query.add(tutor);
        }
        return query;
    }

    public static void saveUser(User user) {
        DataStore store = User.Role.TUTOR.equals(user.getRole()) ? tutorStore : userStore;
        user.store(store.getOrCreateContainer("id", user.getId()));

        if (user.isNew()) EmailManager.sendWelcome(user);
    }

    public static TimeSlot getTimeSlot(String id){ // the timeslot ID is (currently) a concatenation of the start DateTime in string format (.toString()) and the tutor user ID 
        
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

        //checking if the time slot is overlapping, maybe make into a seperate function?
        for(DataContainer dc : timeSlotStore.getContainers("tutorid", timeslot.getTutorID())) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.getTutorID().equals(timeslot.getTutorID())){
                ts.overlapping(timeslot); 
            }
        }
        DataContainer container = timeSlotStore.createContainer();
        timeslot.store(container);
    }

    public static ArrayList<TimeSlot> searchBySubject(TimeSlot.subjectTypes subject){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();
        // can't think of a better way than to open up the containers and search each one
        for(DataContainer dc : timeSlotStore.getContainers()) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.subjects.contains(subject)) matches.add(ts);

            }
        return matches;
    }
    public static ArrayList<TimeSlot> searchByTutor(String tutorid){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();
        for(DataContainer dc : timeSlotStore.getContainers("tutorid", tutorid)) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.getTutorID().equals(tutorid)) matches.add(ts);

            }
        return matches;
    }

    public static ArrayList<TimeSlot> searchByInterval(Interval interval){ // easy way to check if a time slot exists in a specified time period
     // not sure how we'll build that interval yet but the option is there
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();
        for(DataContainer dc : timeSlotStore.getContainers("starttime", interval.getStart().toString())) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.timeSlotInterval.overlaps(interval)) matches.add(ts);

            }
        return matches;
    }

    // below are more filter-like search methods. the above ones may be redundant now but im keeping them for a sec til i know for sure
    // these are exclusive search as well. inclusive search can be done later but i don't think most users would want it
    // the subject is the backbone of all of them, so it's required. i figured it'd make the most sense as you would always know what subject you want to find tutoring in

    public static ArrayList<TimeSlot> searchResults(TimeSlot.subjectTypes subject){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();
        
        for(DataContainer dc : timeSlotStore.getContainers()) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.subjects.contains(subject)) matches.add(ts);

            }
        return matches;
    }
    public static ArrayList<TimeSlot> searchResults(TimeSlot.subjectTypes subject, Interval interval){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();

        for(DataContainer dc : timeSlotStore.getContainers("starttime", interval.getStart().toString())) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.subjects.contains(subject)) matches.add(ts);

            }
        
        return matches;
    }
    public static ArrayList<TimeSlot> searchResults(TimeSlot.subjectTypes subject, String tutorid){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();

        for(DataContainer dc : timeSlotStore.getContainers("tutorid", tutorid)) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.subjects.contains(subject)) matches.add(ts);

            }
        return matches;
    }
    public static ArrayList<TimeSlot> searchResults(TimeSlot.subjectTypes subject, String tutorid, Interval interval){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();
        for(DataContainer dc : timeSlotStore.getContainers("tutorid", tutorid)) {
            TimeSlot ts = new TimeSlot(dc);
            if (ts.subjects.contains(subject) && ts.timeSlotInterval.overlaps(interval)) matches.add(ts);

            }
        
        return matches;
    }
}
