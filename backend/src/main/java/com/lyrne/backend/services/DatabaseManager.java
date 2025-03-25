package com.lyrne.backend.services;

import com.lyrne.backend.Main;
import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.User;
import com.lyrne.backend.TimeSlot.subjectTypes;

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

    public static void saveUser(User user) {
        DataStore store = User.Role.TUTOR.equals(user.getRole()) ? tutorStore : userStore;
        user.store(store.getOrCreateContainer("id", user.getId()));

        if (user.isNew()) EmailManager.sendWelcome(user);
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

    public static ArrayList<TimeSlot> searchBySubject(TimeSlot.subjectTypes subject){
        ArrayList<TimeSlot> matches = new ArrayList<TimeSlot>();

        for(DataContainer dc : timeSlotStore.getContainers(subjectTypes.getId(subject), true)) {
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
