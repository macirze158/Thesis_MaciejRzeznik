package pl.polsl.thesis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;


    public void sendAccountCreated(String to, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        String text = """
                e-Lab account has been created
                Your login credentials
                email: %s
                password: %s
                After logging in, change your password in user settings
                """.formatted(to, password);
        message.setTo(to);
        message.setSubject("Account created");
        message.setText(text);
        emailSender.send(message);
    }

    public void sendCitoResult(String pesel, String firstName, String lastName, Long resultId, String sendTo) {
        SimpleMailMessage message = new SimpleMailMessage();
        String text = """
                e-Lab
                There is new CITO result
                for patient %s %s
                PESEL: %s
                Result ID: %s
                """.formatted(firstName, lastName, pesel, resultId);
        message.setTo(sendTo);
        message.setSubject("New cito result");
        message.setText(text);
        emailSender.send(message);
    }

    public void sendDiloResult(String pesel, String firstName, String lastName, Long resultId, String sendTo) {
        SimpleMailMessage message = new SimpleMailMessage();
        String text = """
                e-Lab
                There is new DILO result
                for patient %s %s
                PESEL: %s
                Result ID: %s
                """.formatted(firstName, lastName, pesel, resultId);
        message.setTo(sendTo);
        message.setSubject("New dilo result");
        message.setText(text);
        emailSender.send(message);
    }

}
