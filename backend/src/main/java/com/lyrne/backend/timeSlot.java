import org.joda.time.DateTime;
import org.joda.time.Interval;

public class timeSlot{ // A timeslot object that can be created by a tutor


    String tutor; // The tutor's name, will be automatically put down 

    Interval timeSlotInterval();

    String[] subjects; // the tutor will likely have multiple teachable subjects
    boolean Booked; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea
    
    public static void timeSlot(DateTime start, DateTime end, String tutorName, String[] subjects){ 
        // note: not sure what type of object the start/end time will be. its a DateTime here but i'll change it accordingly
        
        // this looks ridiculous so im sure there will be a better way to get a time object from the front end

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
    
    public void book


    public static void main(String[] args){
        
    }
}