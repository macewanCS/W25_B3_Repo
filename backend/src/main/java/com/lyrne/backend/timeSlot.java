import org.joda.time.DateTime;
import org.joda.time.Interval;

public class timeSlot{ // A timeslot object that can be created by a tutor


    String tutor; // The tutor's name, will be automatically put down 

    Interval timeSlotInterval;

    String[] subjects; // the tutor will likely have multiple teachable subjects
    boolean booked; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea
    
    String bookedBy; // the student whom booked the timeslot

    public void timeSlot(DateTime start, DateTime end, String tutorName, String[] subjects){ 
        // note: not sure what type of object the start/end time will be. its a DateTime here but i'll change it accordingly
        
 

        this.timeSlotInterval = new Interval(start, end); // i think this is how you do it in java tho ngl im copying an example
        this.subjects = subjects;
        this.tutor = tutorName; 
    }
       
    // i think this works
    // might not be able to return DateTime objects if the front end cant read them. no clue if it'll support the joda time classes, so i'll change this accordingly if need be
    public DateTime getStartTime(){
        return timeSlotInterval.getStart();
    }
    public DateTime getEndTime(){
        return timeSlotInterval.getEnd();
    }
    public String getTutorName(){
        return tutor;
    }
    public String[] getSubjects(){
        return subjects;
    }
    
    public boolean isBooked(){
        return booked;
    }
    public void bookTimeSlot(String studentName){
        this.bookedBy = studentName; // later perhaps a user ID so that two people can have the same name
        booked = true;
    }
    public void cancelTimeSlot(){
        this.bookedBy = new String(""); 
        booked = false;
    }



    public static void main(String[] args){ // testing
     //-------------------
     DateTime start = new DateTime();
     DateTime end = new DateTime(2025, 2, 20, 3, 0, 0);
     String name = new String("Dr Tutor");
     String[] subjects = new String[] {"Math", "Science"};
     timeSlot mts = new TimeSlot(start, end, name, subjects);

     System.out.println(mts.getStartTime());
     System.out.println(mts.getEndTime());
     System.out.println(mts.getTutorName());
     System.out.println(mts.getSubjects());
     //-------------------

    }
}