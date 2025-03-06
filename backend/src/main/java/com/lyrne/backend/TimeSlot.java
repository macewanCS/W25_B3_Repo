package com.lyrne.backend;
import java.util.Optional;
import org.joda.time.DateTime;
import org.joda.time.Interval;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

public class TimeSlot{ // A timeslot object that can be created by a tutor


    private String tutor; // The tutor's name, will be automatically put down 

    private transient Interval timeSlotInterval;

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
        return timeSlotInterval.getStart().toString();
    }
    public String getEndTime(){
        return timeSlotInterval.getEnd().toString();
    }
    public String getTutorID(){
        return tutor;
    }
    
    public String getBookedBy() { 
        return bookedBy;
    }
    public String getID(){
        return id;
    }

    public boolean isBooked(){
        return booked;
    }
    public void bookTimeSlot(String studentName){
        this.bookedBy = studentName; // later perhaps a user ID so that two people can have the same name
        this.booked = true;
    }
    public void cancelTimeSlot(){
        this.bookedBy = new String(""); 
        this.booked = false;
    }


    public void store(DataContainer container) {
    container.put(JavaTypes.STRING, "starttime", this.getStartTime());
    container.put(JavaTypes.STRING, "endtime", this.getEndTime());
    container.put(JavaTypes.STRING, "tutorid", this.getTutorID());
    container.put(JavaTypes.BOOL, "isbooked", this.isBooked()); 
    container.put(JavaTypes.STRING, "bookedby", this.getBookedBy());
    container.put(JavaTypes.STRING, "id", this.getID());
    }

    public void load(DataContainer container) {
        Optional<String> st = container.get(JavaTypes.STRING, "starttime");
        Optional<String> en = container.get(JavaTypes.STRING, "endtime");
        Optional<String> tn = container.get(JavaTypes.STRING, "tutorid");
        Optional<Boolean> ib = container.get(JavaTypes.BOOL, "isbooked");
        Optional<String> bb = container.get(JavaTypes.STRING, "bookedby");
        Optional<String> id = container.get(JavaTypes.STRING, "id");
        
        // why do i have to check for schrodinger's cat, man 

        if (st.isPresent()) this.start = st.get(); 
        if (en.isPresent()) this.end = en.get(); 
        if (tn.isPresent()) this.tutor = tn.get();
        if (ib.isPresent()) this.booked = ib.get();
        if (bb.isPresent()) this.bookedBy = bb.get();
        if (id.isPresent()) this.id = id.get();
        this.timeSlotInterval = new Interval(DateTime.parse(this.start), DateTime.parse(this.end));

    }

    public void printInfo(){
        System.out.println(this.start);
        System.out.println(this.end);
        System.out.println(this.tutor);
        System.out.println(this.booked);
        System.out.println(this.bookedBy);
        System.out.println(this.id);
    }


}
