import org.joda.time.DateTime;
import org.joda.time.Interval;

public class timeSlot{ // A timeslot object that can be created by a tutor

    
    String tutor; // The tutor's name, will be automatically put down 
     // note: replace start and end times as well as duration with the joda classes
    
    String[] subjects; // the tutor will likely have multiple teachable subjects
    boolean Booked; // determining if a time slot is booked by a student might be more complicated than a boolean but you get the idea


    //mock methods

    public void setStartTime(); // note that i wont be setting any example parameters, that can be figured out during further development
    public void setDuration(); // setDuration, setStartTime and setEndTime will all be able to overwrite the time to whatever is most recently written. 
                               // setting a start time and then a duration will result in the end time being automatically determined, and the same goes for any combo of the three methods
    public void setEndTime();




    public static void main(String[] args){
        
    }
}