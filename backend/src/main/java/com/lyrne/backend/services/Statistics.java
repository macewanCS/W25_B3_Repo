package com.lyrne.backend.services;
import java.util.Optional;
import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.services.DatabaseManager;
import lombok.Getter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

@Getter
public class Statistics {


    public Integer users = 0; // # of users
    public Integer tutors = 0; // # of users that are tutors
    public Integer students = 0; // # of users that are students
    public Integer timeslots = 0; // you get the idea
    public Integer bookedTimeslots = 0;
    public Integer math = 0;
    public Integer science = 0;
    public Integer social = 0;
    public Integer english = 0;
    public Integer biology = 0;
    public Integer chemistry = 0;
    public Integer physics = 0;

        public void generateStatistics(){


        }
        private void timeslotStatistics(){
            for(DataContainer dc : DatabaseManager.timeSlotStore.getContainers()) {
                TimeSlot ts = new TimeSlot(dc);
                this.timeslots += 1;
                if (ts.isBooked()) this.bookedTimeslots += 1;
                if ts.TimeSlot.subjectTypes.MATH

                }
        }
    
    

}
