package com.lyrne.backend;

import lombok.Getter;
import java.util.Optional;
import java.util.ArrayList;
import java.sql.DatabaseMetaData;
import java.util.ArrayList;
import org.joda.time.DateTime;
import org.joda.time.Interval;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.Statistics;
import com.lyrne.backend.services.EmailManager;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

public class TimeSlot{ // A timeslot object that can be created by a tutor


    private String tutor; // The tutor's name, will be automatically put down
    public transient Interval timeSlotInterval;
    @Getter

    public enum subjectTypes {
        MATH(0), SCIENCE(1), SOCIAL(2), ENGLISH(3), PHYSICS(4), BIOLOGY(5), CHEMISTRY(6);

        private final int subjectID;

        subjectTypes(int subjectID) {
            this.subjectID = subjectID;
        }

        public static String getId(subjectTypes subject) {
            if (subject.equals(subjectTypes.ENGLISH)) return "iseng";
            if (subject.equals(subjectTypes.MATH)) return "ismath";
            if (subject.equals(subjectTypes.SCIENCE)) return "issci";
            if (subject.equals(subjectTypes.SOCIAL)) return "issoc";
            if (subject.equals(subjectTypes.BIOLOGY)) return "isbio";
            if (subject.equals(subjectTypes.PHYSICS)) return "isphys";
            if (subject.equals(subjectTypes.CHEMISTRY)) return "ischem";
            return ""; // lazy solution my b
        }


    }

    private boolean booked = false; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea
    @Getter
    private String bookedBy; // the student whom booked the timeslot
    private String start;
    private String end;
    @Getter
    public String id; // the ID will just be a concatenation of the start time & tutor ID for now
    public ArrayList<subjectTypes> subjects = new ArrayList<>(); 


    public TimeSlot(DateTime start, DateTime end, String tutorID){
        this.start = start.toString();
        this.end = end.toString();
        this.timeSlotInterval = new Interval(start, end);
        this.tutor = tutorID; 
        this.id = this.start.concat(tutorID);
    }

    public TimeSlot(String start, String end, String tutorID){
        this.timeSlotInterval = new Interval(DateTime.parse(start), DateTime.parse(end)); 
        this.start = start;
        this.end = end;
        this.tutor = tutorID;
        this.id = this.start.concat(tutorID); 
    }

    public TimeSlot(DataContainer container){ // create a timeslot from the database. forgive me if this is not how we should do it but its how i think this works
        this.load(container);
    }

    // i think this works
    // returned as string, can be turned right back into a DateTime
    public String getStartTime(){
        return this.timeSlotInterval.getStart().toString();
    }

    public String getEndTime(){
        return this.timeSlotInterval.getEnd().toString();
    }

    public String getTutorID(){
        return this.tutor;
    }

    public void bookTimeSlot(String studentName) {
        this.bookedBy = studentName; // later perhaps a user ID so that two people can have the same name
    }

    public String getID(){
        return this.id;
    }

    public void bookTimeSlot(User user){ // "user" is the one who is making the booking (aka the student)
        this.bookedBy = user.getId(); 

        this.booked = true;
        
        // getting the tutor's username based on ID
        Optional<DataContainer> dc = DatabaseManager.tutorStore.getContainer("id", this.tutor);
        DataContainer container = dc.orElse(null);
        Optional<String> un = container.get(JavaTypes.STRING, "username");
        String username;
        username = un.orElse(null);

        EmailManager.sendBookingConfirmation(user, this.timeSlotInterval, username);
    }
    public void cancelTimeSlot(){
        this.bookedBy = "";
        this.booked = false;
    }
    public void overlapping(TimeSlot ts){
        if (this.timeSlotInterval.overlaps(ts.timeSlotInterval)){
            throw new OverlappingIntervalException("Time Slot Intervals cannot overlap with existing time slots.");
        }
    }
    class OverlappingIntervalException extends RuntimeException {
        public OverlappingIntervalException(String message) {
            super(message);
        }
    }
    public void addSubject(subjectTypes subject){
        this.subjects.add(subject);
    }

    public void store(DataContainer container) {
        container.put(JavaTypes.STRING, "starttime", this.getStartTime());
        container.put(JavaTypes.STRING, "endtime", this.getEndTime());
        container.put(JavaTypes.STRING, "tutorid", this.getTutorID());

        container.put(JavaTypes.BOOL, "isbooked", this.isBooked());
        container.put(JavaTypes.STRING, "bookedby", this.getBookedBy());
        container.put(JavaTypes.STRING, "id", this.getId());
    }

    public void load(DataContainer container) {
        container.get(JavaTypes.STRING, "starttime").ifPresent(start -> this.start = start);
        container.get(JavaTypes.STRING, "endtime").ifPresent(end -> this.end = end);
        container.get(JavaTypes.STRING, "tutorid").ifPresent(tutor -> this.tutor = tutor);
        container.get(JavaTypes.BOOL, "isbooked").ifPresent(booked -> this.booked = booked);
        container.get(JavaTypes.STRING, "bookedby").ifPresent(bookedby -> this.bookedBy = bookedby);
        container.get(JavaTypes.STRING, "id").ifPresent(id -> this.id = id);
        container.get(JavaTypes.BOOL, "iseng").ifPresent(eng -> { if (eng) subjects.add(subjectTypes.ENGLISH); });
        container.get(JavaTypes.BOOL, "ismath").ifPresent(math -> { if (math) subjects.add(subjectTypes.MATH); });
        container.get(JavaTypes.BOOL, "issci").ifPresent(sci -> { if (sci) subjects.add(subjectTypes.SCIENCE); });
        container.get(JavaTypes.BOOL, "issoc").ifPresent(soc -> { if (soc) subjects.add(subjectTypes.SOCIAL); });
        container.get(JavaTypes.BOOL, "isbio").ifPresent(bio -> { if (bio) subjects.add(subjectTypes.BIOLOGY); });
        container.get(JavaTypes.BOOL, "isphys").ifPresent(phys -> { if (phys) subjects.add(subjectTypes.PHYSICS); });
        container.get(JavaTypes.BOOL, "ischem").ifPresent(chem -> { if (chem) subjects.add(subjectTypes.CHEMISTRY); });

        
        this.timeSlotInterval = new Interval(DateTime.parse(this.start), DateTime.parse(this.end));

    }

    public void printInfo(){
        System.out.println("\nStart time: ");
        System.out.println(this.start);
        System.out.println("End time: ");
        System.out.println(this.end);
        System.out.println("Tutor ID: ");
        System.out.println(this.tutor);
        System.out.println("Booked? ");
        System.out.println(this.booked);
        System.out.println("Booked by: ");
        System.out.println(this.bookedBy);
        System.out.println("Time slot ID: ");
        System.out.println(this.id);
        System.out.println("Subjects: ");
        System.out.println(this.subjects);
    }
}
