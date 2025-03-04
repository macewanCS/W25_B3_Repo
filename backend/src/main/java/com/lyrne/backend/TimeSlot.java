package com.lyrne.backend;

import lombok.Getter;
import org.joda.time.DateTime;
import org.joda.time.Interval;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

public class TimeSlot{ // A timeslot object that can be created by a tutor

    private String tutor; // The tutor's name, will be automatically put down
    private transient Interval timeSlotInterval;
    @Getter
    private boolean booked = false; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea
    @Getter
    private String bookedBy; // the student whom booked the timeslot
    private String start;
    private String end;
    @Getter
    public String id; // the ID will just be a concatenation of the start time & tutor ID for now

    // to do: prevent overlapping bookings

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

    public void bookTimeSlot(String studentName){
        this.bookedBy = studentName; // later perhaps a user ID so that two people can have the same name
        this.booked = true;
    }

    public void cancelTimeSlot(){
        this.bookedBy = "";
        this.booked = false;
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
        container.get(JavaTypes.STRING, "starttime").ifPresent(s -> this.start = s);
        container.get(JavaTypes.STRING, "endtime").ifPresent(s -> this.end = s);
        container.get(JavaTypes.STRING, "tutorid").ifPresent(s -> this.tutor = s);
        container.get(JavaTypes.BOOL, "isbooked").ifPresent(aBoolean -> this.booked = aBoolean);
        container.get(JavaTypes.STRING, "bookedby").ifPresent(s -> this.bookedBy = s);
        container.get(JavaTypes.STRING, "id").ifPresent(s -> this.id = s);
        this.timeSlotInterval = new Interval(DateTime.parse(this.start), DateTime.parse(this.end));
    }
}