package com.lyrne.backend.services;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.emails.Emails;
import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.Recipient;
import com.mailersend.sdk.exceptions.MailerSendException;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;

public class SendEmail{

    public void SendEmail() throws IOException{
        
        Email email = new Email();

        email.setFrom("Lyrne Emailer", "lyrne@trial-0p7kx4x79pml9yjr.mlsender.net");
        email.addRecipient("Elijah", "flamingoranges6@gmail.com");

        email.setSubject("successful test");

        email.setPlain("here is a successful test email :100:");

        MailerSend ms = new MailerSend();
        String file = "C:\\Users\\Golde\\GitRepos\\W25_B3_Repo\\email_api_key.txt"; // if this line is still in the committed version, oops 
        List<String> lines = Files.readAllLines(Paths.get(file));

        if (!lines.isEmpty()) {
            String token = lines.get(0);
            ms.setToken(token);
        }
        this.sendItOutNow(ms, email);
        System.out.println("hope it works");

    }
    public void sendItOutNow(MailerSend ms, Email email){
        try {    
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
            e.printStackTrace();
        }
    } 

}
