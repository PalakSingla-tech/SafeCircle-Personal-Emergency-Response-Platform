package com.safecircle.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioSmsServiceImpl implements SmsService {

    @Value("${twilio.account.sid:dummy}")
    private String accountSid;

    @Value("${twilio.auth.token:dummy}")
    private String authToken;

    @Value("${twilio.phone.number:+1234567890}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        if (!"dummy".equals(accountSid) && accountSid != null) {
            Twilio.init(accountSid, authToken);
        }
    }

    @Override
    public void sendSms(String toPhoneNumber, String messageText) {
        if ("dummy".equals(accountSid) || accountSid == null || accountSid.isEmpty()) {
            System.out.println("Twilio SMS Log: To " + toPhoneNumber + " -> " + messageText);
            return;
        }

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    messageText
            ).create();
            System.out.println("SMS sent successfully with SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send SMS to " + toPhoneNumber + ": " + e.getMessage());
        }
    }
}
