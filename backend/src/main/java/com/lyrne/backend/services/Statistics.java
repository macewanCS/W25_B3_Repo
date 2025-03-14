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

@Getter
public class Statistics {


    public static Integer timeslots = 0; // # of timeslots
    public static Integer bookedTimeslots = 0;
    private static Map<TimeSlot.subjectTypes, Integer> subjectCounts = new HashMap<>(); // # of timeslots published by subject
    private static Map<User.Role, Integer> userCounts = new HashMap<>(); // # of users by role


        public static void generateStatistics(){
            timeslotStatistics();
            userStatistics();

        }
        private static void timeslotStatistics(){
            
            for (TimeSlot.subjectTypes subject : TimeSlot.subjectTypes.values()) {
                subjectCounts.put(subject, 0);
            }
            
            for(DataContainer dc : DatabaseManager.timeSlotStore.getContainers()) {
                TimeSlot ts = new TimeSlot(dc);
                timeslots += 1;
                if (ts.isBooked()) bookedTimeslots += 1;

                for (TimeSlot.subjectTypes subject : ts.subjects) {
                    subjectCounts.put(subject, subjectCounts.get(subject) + 1);
                }

                }
        }

        private static void userStatistics(){
            for (User.Role user : User.Role.values()) {
                userCounts.put(user, 0);
            }
            
            userCounts.put(User.Role.TUTOR, DatabaseManager.tutorStore.getContainers().size());
            for(DataContainer dc : DatabaseManager.userStore.getContainers()) {
                User user = new User(dc);

                userCounts.put(user.getRole(), userCounts.get(user.getRole()) + 1);
                

                }
            
        }
       
    
    

}
