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

    public TimeSlot(DateTime start, DateTime end, String tutorName){ 
        // note: not sure what type of object the start/end time will be. its a DateTime here but i'll change it accordingly
        this.timeSlotInterval = new Interval(start, end); // i think this is how you do it in java tho ngl im copying an example
        
        this.tutor = tutorName; 
    }
    public TimeSlot(String start, String end, String tutorName){ 
        // note: not sure what type of object the start/end time will be. its a DateTime here but i'll change it accordingly
        this.timeSlotInterval = new Interval(DateTime.parse(start), DateTime.parse(end)); 
        this.start = start;
        this.end = end;
        this.tutor = tutorName; 
    }
    

    // i think this works
    // returned as string, can be turned right back into a DateTime
    public String getStartTime(){
        return timeSlotInterval.getStart().toString();
    }
    public String getEndTime(){
        return timeSlotInterval.getEnd().toString();
    }
    public String getTutorName(){
        return tutor;
    }
    
    public String getBookedBy() { 
        return bookedBy;
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
    container.put(JavaTypes.STRING, "tutorname", this.getTutorName());
    container.put(JavaTypes.BOOL, "isbooked", this.isBooked()); 
    container.put(JavaTypes.STRING, "bookedby", this.getBookedBy());
    }

    public void load(DataContainer container) {
        Optional<String> st = container.get(JavaTypes.STRING, "starttime");
        Optional<String> en = container.get(JavaTypes.STRING, "endtime");
        Optional<String> tn = container.get(JavaTypes.STRING, "tutorname");
        Optional<Boolean> ib = container.get(JavaTypes.BOOL, "isbooked");
        Optional<String> bb = container.get(JavaTypes.STRING, "bookedby");
        
        // why do i have to check for schrodinger's cat man 

        if (st.isPresent()) {this.start = st.get();} // sorry if this is a formatting faux pas
        if (en.isPresent()) {this.end = en.get();} // i just want to reduce the line count for this function
        if (tn.isPresent()) {this.tutor = tn.get();}
        if (ib.isPresent()) {this.booked = ib.get();}
        if (bb.isPresent()) {this.bookedBy = bb.get();}
        this.timeSlotInterval = new Interval(DateTime.parse(this.start), DateTime.parse(this.end));

    }


    public static void main(String[] args){
           //------------------- Testing block!
           DateTime start = new DateTime(2025, 2, 20, 1, 0);
           DateTime end = new DateTime(2025, 2, 20, 3, 0);
           String name = new String("Dr Tutor");
           TimeSlot mts = new TimeSlot(start, end, name);
   
        



           //-------------------
    }
   
}