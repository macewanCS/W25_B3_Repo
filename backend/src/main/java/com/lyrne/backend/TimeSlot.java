package com.lyrne.backend;
import java.util.Optional;
import java.sql.DatabaseMetaData;
import java.util.ArrayList;
import org.joda.time.DateTime;
import org.joda.time.Interval;
import com.lyrne.backend.User;
import com.lyrne.backend.TimeSlot.subjectTypes;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.services.EmailManager;
import com.lyrne.backend.services.SendEmail;

import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

public class TimeSlot{ // A timeslot object that can be created by a tutor


    private String tutor; // The tutor's id, will be automatically put down 

    public transient Interval timeSlotInterval;

    private boolean booked = false; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea
    
    private String bookedBy; // the student whom booked the timeslot

    private String start;
    private String end;
    public String id; // the ID will just be a concatenation of the start time & tutor ID for now


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
    
    public String getBookedBy() { 
        return this.bookedBy;
    }
    public String getID(){
        return this.id;
    }

    public boolean isBooked(){
        return this.booked;
    }
    public void bookTimeSlot(User user){ // "user" is the one who is making the booking (aka the student)
        this.bookedBy = user.getId(); 
        this.booked = true;
        
        // getting the tutor's username based on ID
        Optional<DataContainer> dc = DatabaseManager.tutorStore.getContainer("id", this.tutor);
        DataContainer container;
        if (dc.isPresent()) container = dc.get();
        else container = null;
        Optional<String> un = container.get(JavaTypes.STRING, "username");
        String username;
        if (un.isPresent()) username = un.get();
        else username = null;

        EmailManager.sendBookingConfirmation(user, this.timeSlotInterval, username);
    }
    public void cancelTimeSlot(){
        this.bookedBy = new String(""); 
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
    public void addSubject(int subject){
        this.subjects.add(subjectTypes.fromId(subject));
    }

    public String subjectsConverter(){ // we're gonna convert the arraylist into a string of numbers to put in the database. yes im normal

        StringBuilder sb = new StringBuilder();
        for (subjectTypes subject : this.subjects){
            sb.append(subject.getId());
        }
        return sb.toString();
        //shoutout chatgpt for showing me stringbuilder

    }

    public void subjectsParser(String subjectsString){
        for (int i = 0; i < subjectsString.length(); i++){
            this.subjects.add(subjectTypes.fromId(Integer.parseInt(subjectsString.substring(i, i+1)))); // kind of a messed up line ngl
            //it takes the integer value of the subject, finds out what subject that is, and adds it to the "subjects" arraylist property of the timeslot
        }
    }

    public void store(DataContainer container) {
    container.put(JavaTypes.STRING, "starttime", this.getStartTime());
    container.put(JavaTypes.STRING, "endtime", this.getEndTime());
    container.put(JavaTypes.STRING, "tutorid", this.getTutorID());
    container.put(JavaTypes.BOOL, "isbooked", this.isBooked()); 
    container.put(JavaTypes.STRING, "bookedby", this.getBookedBy());
    container.put(JavaTypes.STRING, "id", this.getID());
    container.put(JavaTypes.STRING , "subjects", this.subjectsConverter());
    }

    public void load(DataContainer container) {
        // i'll rewrite this in the way it was done in the User class at some point. maybe
        Optional<String> st = container.get(JavaTypes.STRING, "starttime");
        Optional<String> en = container.get(JavaTypes.STRING, "endtime");
        Optional<String> tn = container.get(JavaTypes.STRING, "tutorid");
        Optional<Boolean> ib = container.get(JavaTypes.BOOL, "isbooked");
        Optional<String> bb = container.get(JavaTypes.STRING, "bookedby");
        Optional<String> id = container.get(JavaTypes.STRING, "id");
        Optional<String> sj = container.get(JavaTypes.STRING, "subjects");
        
        // why do i have to check for schrodinger's cat, man 

        if (st.isPresent()) this.start = st.get(); 
        if (en.isPresent()) this.end = en.get(); 
        if (tn.isPresent()) this.tutor = tn.get();
        if (ib.isPresent()) this.booked = ib.get();
        if (bb.isPresent()) this.bookedBy = bb.get();
        if (id.isPresent()) this.id = id.get();
        if (sj.isPresent()) this.subjectsParser(sj.get());
        this.timeSlotInterval = new Interval(DateTime.parse(this.start), DateTime.parse(this.end));

    }

    public void printInfo(){
        System.out.println(this.start);
        System.out.println(this.end);
        System.out.println(this.tutor);
        System.out.println(this.booked);
        System.out.println(this.bookedBy);
        System.out.println(this.id);
        System.out.println(this.subjects);
    }


}
