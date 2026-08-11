package com.safecircle.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("SafeCircle - Password Reset Request");
            message.setText("Hello,\n\n" +
                    "You have requested to reset your password. Please click the link below to set a new password:\n\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 10 minutes.\n\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "Regards,\nSafeCircle Team");
            
            mailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ". Printing link to console as fallback.");
            System.out.println("MAGIC LINK: " + resetLink);
        }
    }
}
