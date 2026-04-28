package com.taskforce.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class WhatsAppService {

    @Value("${twilio.account.sid:AC_PLACEHOLDER}")
    private String accountSid;

    @Value("${twilio.auth.token:AUTH_TOKEN_PLACEHOLDER}")
    private String authToken;

    @Value("${twilio.whatsapp.number:whatsapp:+14155238886}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (!accountSid.equals("AC_PLACEHOLDER")) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendLoginNotification(String toEmail, String name, String userPhone) {
        log.info("Attempting to send WhatsApp login notification to: {} ({})", name, userPhone);
        
        String messageBody = String.format("Hello %s, a new login was detected on your Bookzy account for email: %s. If this wasn't you, please secure your account.", name, toEmail);
        
        try {
            if (!accountSid.equals("AC_PLACEHOLDER") && userPhone != null && !userPhone.isEmpty()) {
                // Format the phone number (ensure it starts with + and has country code)
                String formattedTo = userPhone.startsWith("+") ? userPhone : "+" + userPhone;
                if (!formattedTo.startsWith("whatsapp:")) {
                    formattedTo = "whatsapp:" + formattedTo;
                }

                log.info("Sending REAL WhatsApp message to: {}", formattedTo);
                
                Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(fromNumber),
                    messageBody
                ).create();
                
                log.info("WhatsApp message sent successfully!");
            } else {
                log.warn("Twilio not configured or User phone missing. Message content: {}", messageBody);
            }
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message. Check your Twilio Sandbox settings and if the number is registered.", e);
        }
    }
}
