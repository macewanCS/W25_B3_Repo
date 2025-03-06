package com.lyrne.backend.services;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.exceptions.MailerSendException;
import com.lyrne.backend.User;

import org.joda.time.Interval;

public class EmailManager {


    public static void sendWelcome(User user){
        String address = user.getEmail();
        User.Role role = user.getRole();
        if (address == null) throw new IllegalArgumentException("Email cannot be null");

        Email email = new Email();
        email.setFrom("Lyrne", "lyrne@trial-0p7kx4x79pml9yjr.mlsender.net");
        email.addRecipient(user.getRole().name(), address);
        email.setSubject("Welcome to Lyrne!");

        if (role.equals(User.Role.TUTOR)) email.setPlain("Welcome to Lyrne tutoring! To get started as a tutor, post a time slot in the app! Fill out the information required, and once it's posted, you'll receive an email notification once it's been booked.");
        else email.setPlain("Welcome to Lyrne tutoring! To get started with our app, use our search functions to find tutoring time slots!\n When you book a time slot, it'll get added to your in-app calendar.");

        sendEmail(address, email);
    }

    public static void sendBookingConfirmation(User user, Interval time, String tutorUsername){
    
        String id = user.getId();
        String address = user.getEmail();

        Email email = new Email();

        email.setFrom("Lyrne Emailer", "lyrne@trial-0p7kx4x79pml9yjr.mlsender.net");
        email.addRecipient(id, address);

        email.setSubject("Tutor booking confirmed!");

        email.setPlain("Your booking  with " + tutorUsername + "at " + time.getStart().toString() + " - " + time.getEnd().toString() + " has been confirmed!"); // will read a lil ugly ngl

        
        sendEmail(address, email);
        

    }

    private static void sendEmail(String address, Email email){
        MailerSend ms = new MailerSend();
        ms.setToken(System.getenv("EMAIL_TOKEN"));
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
