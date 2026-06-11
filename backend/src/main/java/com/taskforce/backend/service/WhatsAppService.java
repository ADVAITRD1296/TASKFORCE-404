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
        if (!accountSid.equals("AC_PLACEHOLDER") && !accountSid.equals("TWILIO_NOT_CONFIGURED")) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio WhatsApp service initialized.");
        } else {
            log.warn("Twilio not configured. WhatsApp messages will be logged only.");
        }
    }

    // ─── Core Sender ───────────────────────────────────────────────────────────

    private void sendMessage(String userPhone, String messageBody) {
        log.info("WhatsApp Message: {}", messageBody);
        try {
            if (!accountSid.equals("AC_PLACEHOLDER") && !accountSid.equals("TWILIO_NOT_CONFIGURED") && userPhone != null && !userPhone.isBlank()) {
                String formattedTo = userPhone.trim().startsWith("+") ? userPhone.trim() : "+" + userPhone.trim();
                if (!formattedTo.startsWith("whatsapp:")) {
                    formattedTo = "whatsapp:" + formattedTo;
                }
                Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(fromNumber),
                    messageBody
                ).create();
                log.info("WhatsApp message sent to {}", formattedTo);
            } else {
                log.warn("Twilio not configured or phone missing. Message logged only.");
            }
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message: {}", e.getMessage());
        }
    }

    // ─── Registration ───────────────────────────────────────────────────────────

    public void sendRegistrationNotification(String name, String userPhone) {
        String msg = String.format(
            "🎉 Welcome to Bookzy, %s!\n\n" +
            "Your account has been created successfully. " +
            "You can now book flights, trains, buses, hotels, and shows — all in one place!\n\n" +
            "Have a great journey! ✈️🚂🏨\n\n— Team Bookzy",
            name
        );
        sendMessage(userPhone, msg);
    }

    // ─── Login ──────────────────────────────────────────────────────────────────

    public void sendLoginNotification(String email, String name, String userPhone) {
        String msg = String.format(
            "🔐 Login Alert — Bookzy\n\n" +
            "Hello %s, a new login was detected on your account (%s).\n\n" +
            "If this was you, no action is needed.\n" +
            "If this wasn't you, please contact our support immediately via the Contact Us page.\n\n" +
            "— Team Bookzy",
            name, email
        );
        sendMessage(userPhone, msg);
    }

    // ─── Flight Booking ─────────────────────────────────────────────────────────

    public void sendFlightBookingConfirmation(String name, String userPhone,
                                              String bookingRef, String details, double totalPrice) {
        String msg = String.format(
            "✈️ Flight Booking Confirmed — Bookzy\n\n" +
            "Hi %s, your flight has been booked successfully!\n\n" +
            "📌 Booking Reference: %s\n" +
            "🛫 Details: %s\n" +
            "💰 Total Paid: ₹%.2f\n\n" +
            "Have a safe flight! Visit 'My Bookings' on Bookzy to manage your booking.\n\n" +
            "— Team Bookzy",
            name, bookingRef, details, totalPrice
        );
        sendMessage(userPhone, msg);
    }

    // ─── Train Booking ──────────────────────────────────────────────────────────

    public void sendTrainBookingConfirmation(String name, String userPhone,
                                             String bookingRef, String details, double totalPrice) {
        String msg = String.format(
            "🚂 Train Booking Confirmed — Bookzy\n\n" +
            "Hi %s, your train ticket has been booked successfully!\n\n" +
            "📌 Booking Reference: %s\n" +
            "🚉 Details: %s\n" +
            "💰 Total Paid: ₹%.2f\n\n" +
            "Bon voyage! Visit 'My Bookings' on Bookzy to manage your ticket.\n\n" +
            "— Team Bookzy",
            name, bookingRef, details, totalPrice
        );
        sendMessage(userPhone, msg);
    }

    // ─── Bus Booking ────────────────────────────────────────────────────────────

    public void sendBusBookingConfirmation(String name, String userPhone,
                                           String bookingRef, String details, double totalPrice) {
        String msg = String.format(
            "🚌 Bus Booking Confirmed — Bookzy\n\n" +
            "Hi %s, your bus ticket has been booked successfully!\n\n" +
            "📌 Booking Reference: %s\n" +
            "🛣️ Details: %s\n" +
            "💰 Total Paid: ₹%.2f\n\n" +
            "Have a comfortable journey! Visit 'My Bookings' on Bookzy to manage your booking.\n\n" +
            "— Team Bookzy",
            name, bookingRef, details, totalPrice
        );
        sendMessage(userPhone, msg);
    }

    // ─── Hotel Booking ──────────────────────────────────────────────────────────

    public void sendHotelBookingConfirmation(String name, String userPhone,
                                             String bookingRef, String details, double totalPrice) {
        String msg = String.format(
            "🏨 Hotel Booking Confirmed — Bookzy\n\n" +
            "Hi %s, your hotel has been booked successfully!\n\n" +
            "📌 Booking Reference: %s\n" +
            "🏠 Details: %s\n" +
            "💰 Total Paid: ₹%.2f\n\n" +
            "Enjoy your stay! Visit 'My Bookings' on Bookzy to manage your booking.\n\n" +
            "— Team Bookzy",
            name, bookingRef, details, totalPrice
        );
        sendMessage(userPhone, msg);
    }

    // ─── Show Booking ───────────────────────────────────────────────────────────

    public void sendShowBookingConfirmation(String name, String userPhone,
                                            String bookingRef, String details, double totalPrice) {
        String msg = String.format(
            "🎬 Show Booking Confirmed — Bookzy\n\n" +
            "Hi %s, your tickets have been booked successfully!\n\n" +
            "📌 Booking Reference: %s\n" +
            "🎭 Details: %s\n" +
            "💰 Total Paid: ₹%.2f\n\n" +
            "Enjoy the show! Visit 'My Bookings' on Bookzy to manage your booking.\n\n" +
            "— Team Bookzy",
            name, bookingRef, details, totalPrice
        );
        sendMessage(userPhone, msg);
    }
}
