package com.lyrne.backend.services;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.lyrne.backend.TimeSlot;
import com.lyrne.backend.services.DatabaseManager;
import com.lyrne.backend.User;
import lombok.Getter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;

@Getter
public class Statistics {

    public Integer timeslots = 0; // # of timeslots
    public Integer bookedTimeslots = 0;
    private final Map<TimeSlot.subjectTypes, Integer> subjectCounts = new HashMap<>(); // # of timeslots published by subject
    private final Map<User.Role, Integer> userCounts = new HashMap<>(); // # of users by role

    public Statistics(){
        timeslotStatistics();
        userStatistics();
    }

    private void timeslotStatistics(){
        for (TimeSlot.subjectTypes subject : TimeSlot.subjectTypes.values()) {
            this.subjectCounts.put(subject, 0);
        }

        for(DataContainer dc : DatabaseManager.timeSlotStore.getContainers()) {
            TimeSlot ts = new TimeSlot(dc);
            timeslots += 1;
            if (ts.isBooked()) bookedTimeslots += 1;

            for (TimeSlot.subjectTypes subject : ts.subjects) {
                this.subjectCounts.put(subject, this.subjectCounts.get(subject) + 1);
            }
        }
    }

    private void userStatistics(){
        for (User.Role user : User.Role.values()) {
            this.userCounts.put(user, 0);
        }

        this.userCounts.put(User.Role.TUTOR, DatabaseManager.tutorStore.getContainers("role", User.Role.TUTOR.ordinal()).size());
        this.userCounts.put(User.Role.TUTOR_PENDING, DatabaseManager.tutorStore.getContainers("role", User.Role.TUTOR_PENDING.ordinal()).size());
        this.userCounts.put(User.Role.STUDENT, DatabaseManager.userStore.getContainers().size());
    }

    public String toJson(){
        Gson gson = new Gson();
        return (gson.toJson(this));
    }
}
