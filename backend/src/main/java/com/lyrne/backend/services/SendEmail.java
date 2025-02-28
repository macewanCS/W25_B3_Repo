package com.lyrne.backend.services;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.exceptions.MailerSendException;
import com.lyrne.backend.User;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;
import org.joda.time.Interval;

public class SendEmail{

    // the functions are probably going to be rewritten to just take a single user as an argument (or multiple?)

    public void sendWelcome(User user){ 
        String id = user.getId();
        String address = user.getEmail();
        User.Role role = user.getRole();

        Email email = new Email();
        email.setFrom("Lyrne Emailer", "lyrne@trial-0p7kx4x79pml9yjr.mlsender.net");

        email.addRecipient(id, address);

        email.setSubject("Welcome to Lyrne!");

        if (role.ordinal() == 3){ // tutor's message
            email.setPlain("Welcome to Lyrne tutoring! To get started as a tutor, post a time slot in the app! Fill out the information required, and once it's posted, you'll receive an email notification once it's been booked.");
        }
        else { // everyone else, default
            email.setPlain("Welcome to Lyrne tutoring! To get started with our app, use our search functions to find tutoring time slots!\n When you book a time slot, it'll get added to your in-app calendar.");
        }
        email.setPlain("Welcome to Lyrne tutoring."); 

        sendEmail(address, email);

    }

    public void sendBookingConfirmation(User user, Interval time, String tutorUsername){
        String id = user.getId();
        String address = user.getEmail();

        Email email = new Email();

        email.setFrom("Lyrne Emailer", "lyrne@trial-0p7kx4x79pml9yjr.mlsender.net");
        email.addRecipient(id, address);

        email.setSubject("Tutor booking confirmed!");

        email.setPlain("Your booking  with " + tutorUsername + "at " + time.getStart().toString() + " - " + time.getEnd().toString() + " has been confirmed!"); // will read a lil ugly ngl

        
        sendEmail(address, email);
        

    }

    private void sendEmail(String address, Email email){
        MailerSend ms = new MailerSend();

        // reading token. if you don't have the token, make a directory named "tokens" within this folder and place the token in a text file "email_api_key". ask me for the token if i didn't share it yet 
        // might rename the file and store multiple tokens in there if we need them
        String file = "\\tokens\\email_api_key.txt";
        try{
            List<String> lines = Files.readAllLines(Paths.get(file));
            if (!lines.isEmpty()) {
                String token = lines.get(0);
                ms.setToken(token);
            }
            System.out.println("sending email to " + address);
        } catch (IOException e) {
            System.out.println("could not find token");
        }

        // sending email
        try {    
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
            System.out.println("failed to send welcome email to" + address);
            e.printStackTrace();
        }
    } 

}
