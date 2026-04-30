package com.taskforce.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiSupportService {

    @Value("${api.groq.key:}")
    private String groqApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAnswer(String question) {
        if (groqApiKey != null && !groqApiKey.isEmpty()) {
            try {
                return callGroqApi(question);
            } catch (Exception e) {
                log.warn("Groq API failed. Falling back to Smart Support Engine.");
            }
        }
        return getSmartFallbackResponse(question);
    }

    private String callGroqApi(String question) {
        String url = "https://api.groq.com/openai/v1/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3-8b-8192");

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content",
            "You are the Bookzy AI Support Assistant — a smart, friendly, and knowledgeable assistant for Bookzy, " +
            "a one-stop travel and entertainment booking platform. You help users with: booking trains, flights, buses, " +
            "hotels, and shows/movies; cancellations and refunds; account and password issues; payment methods; " +
            "loyalty points; WhatsApp notifications; and general platform navigation. " +
            "Always be concise, warm, and solution-oriented. If unsure, recommend the Contact Us page.");

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", question);

        body.put("messages", new Object[]{systemMessage, userMessage});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("choices")) {
            java.util.List<Map<String, Object>> choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
            if (!choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        }
        throw new RuntimeException("Empty response from Groq");
    }

    private String getSmartFallbackResponse(String q) {
        if (q == null || q.trim().isEmpty())
            return "I didn't catch that. Could you please rephrase your question?";

        q = q.toLowerCase().trim();

        // --- Greetings ---
        if (q.matches(".*\\b(hello|hi|hey|greetings|good morning|good afternoon|good evening|howdy|what's up|sup)\\b.*")) {
            return "👋 Hello! I'm your Bookzy AI Assistant. I can help you with:\n" +
                   "• Booking trains, flights, buses, hotels, or shows\n" +
                   "• Cancellations & refunds\n" +
                   "• Payment & account issues\n" +
                   "• WhatsApp notifications\n\nWhat can I help you with today?";
        }

        // --- What is Bookzy ---
        if ((q.contains("what") && q.contains("bookzy")) || q.contains("about bookzy") || q.contains("tell me about")) {
            return "🌟 Bookzy is a one-stop travel & entertainment platform where you can:\n" +
                   "• Book flights, trains, and buses\n" +
                   "• Reserve hotels across India\n" +
                   "• Book movie shows and live events\n" +
                   "All from a single dashboard — no need to visit multiple websites!";
        }

        // --- Registration / Sign Up ---
        if (q.contains("register") || q.contains("sign up") || q.contains("create account") || q.contains("new account")) {
            return "📝 To create a Bookzy account:\n" +
                   "1. Click 'Join Free' on the top-right of any page.\n" +
                   "2. Fill in your name, email, phone, and password.\n" +
                   "3. Click 'Register' — that's it!\n\nYou can immediately start booking after registration.";
        }

        // --- Login ---
        if (q.contains("login") || q.contains("log in") || q.contains("sign in") || q.contains("can't login") || q.contains("cannot login")) {
            return "🔐 To log in to Bookzy:\n" +
                   "1. Click 'Login' on the top-right corner.\n" +
                   "2. Enter your registered email and password.\n" +
                   "3. Click 'Login'.\n\nIf you've forgotten your password, please contact us at support and we'll reset it for you.";
        }

        // --- Password ---
        if (q.contains("password") || q.contains("forgot") || q.contains("reset password")) {
            return "🔑 Forgot your password? Here's what to do:\n" +
                   "• Currently, password reset is done through our support team.\n" +
                   "• Go to the 'Contact Us' page and send us your registered email.\n" +
                   "• We'll send you a reset link within a few hours.\n\nTip: Make sure to use a strong, unique password!";
        }

        // --- Cancel Flight ---
        if ((q.contains("cancel") || q.contains("cancellation")) && (q.contains("flight") || q.contains("plane") || q.contains("airline"))) {
            return "✈️❌ Flight Cancellation on Bookzy:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Filter by 'Flights' and find your booking.\n" +
                   "3. Click 'Cancel Booking' next to the flight.\n" +
                   "4. Confirm the cancellation.\n\n" +
                   "📌 Cancellation Policy:\n" +
                   "• Cancelled >24 hrs before departure: Full refund minus ₹300 service fee.\n" +
                   "• Cancelled within 24 hrs: 50% refund.\n" +
                   "• No-show: No refund.\n\n" +
                   "Refunds are processed to your original payment method within 3–5 business days.";
        }

        // --- Cancel Train ---
        if ((q.contains("cancel") || q.contains("cancellation")) && (q.contains("train") || q.contains("railway") || q.contains("rail"))) {
            return "🚂❌ Train Ticket Cancellation on Bookzy:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Filter by 'Trains' and find your booking.\n" +
                   "3. Click 'Cancel Booking'.\n" +
                   "4. Confirm the cancellation.\n\n" +
                   "📌 Cancellation Policy:\n" +
                   "• Cancelled >48 hrs before departure: Full refund minus ₹100 fee.\n" +
                   "• Cancelled 12–48 hrs before: 75% refund.\n" +
                   "• Cancelled within 12 hrs: No refund.\n\n" +
                   "Refunds are processed within 3–5 business days.";
        }

        // --- Cancel Bus ---
        if ((q.contains("cancel") || q.contains("cancellation")) && (q.contains("bus") || q.contains("coach"))) {
            return "🚌❌ Bus Ticket Cancellation on Bookzy:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Filter by 'Buses' and find your booking.\n" +
                   "3. Click 'Cancel Booking'.\n" +
                   "4. Confirm the cancellation.\n\n" +
                   "📌 Cancellation Policy:\n" +
                   "• Cancelled >12 hrs before departure: Full refund minus ₹50 fee.\n" +
                   "• Cancelled within 12 hrs: No refund.\n\n" +
                   "Refunds are processed within 3–5 business days.";
        }

        // --- Cancel Hotel ---
        if ((q.contains("cancel") || q.contains("cancellation")) && (q.contains("hotel") || q.contains("room") || q.contains("stay") || q.contains("accommodation"))) {
            return "🏨❌ Hotel Booking Cancellation on Bookzy:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Filter by 'Hotels' and find your booking.\n" +
                   "3. Click 'Cancel Booking'.\n" +
                   "4. Confirm the cancellation.\n\n" +
                   "📌 Cancellation Policy:\n" +
                   "• Cancelled >48 hrs before check-in: Full refund.\n" +
                   "• Cancelled within 48 hrs: First night charge applies.\n" +
                   "• No-show: No refund.\n\n" +
                   "Refunds are processed within 3–5 business days.";
        }

        // --- Cancel Show/Movie ---
        if ((q.contains("cancel") || q.contains("cancellation")) && (q.contains("show") || q.contains("movie") || q.contains("cinema") || q.contains("concert") || q.contains("event"))) {
            return "🎬❌ Show/Movie Ticket Cancellation on Bookzy:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Filter by 'Shows' and find your booking.\n" +
                   "3. Click 'Cancel Booking'.\n" +
                   "4. Confirm the cancellation.\n\n" +
                   "📌 Note: Show tickets are generally non-refundable within 2 hours of showtime.\n" +
                   "Cancelled before 2 hours: Full refund.\n\n" +
                   "Refunds are processed within 3–5 business days.";
        }

        // --- Trains (Booking) ---
        if (q.contains("train") || q.contains("railway") || q.contains("irctc") || q.contains("rail")) {
            return "🚂 Booking a Train on Bookzy:\n" +
                   "1. Click 'Travel' → 'Trains' from the top menu.\n" +
                   "2. Enter your origin and destination station.\n" +
                   "3. Select your travel date.\n" +
                   "4. Browse available trains and choose your preferred class (Sleeper, 3AC, 2AC, etc.).\n" +
                   "5. Click 'Book Now' and confirm payment.\n\nYou'll receive a booking confirmation on your dashboard!";
        }

        // --- Flights ---
        if (q.contains("flight") || q.contains("plane") || q.contains("airline") || q.contains("airport") || q.contains("flying")) {
            return "✈️ Booking a Flight on Bookzy:\n" +
                   "1. Click 'Travel' → 'Flights' from the top menu.\n" +
                   "2. Enter departure & arrival city/airport.\n" +
                   "3. Select your travel date.\n" +
                   "4. Choose from available airlines and seat classes.\n" +
                   "5. Click 'Book Now' and confirm payment.\n\nYour e-ticket will appear in 'My Bookings' instantly!";
        }

        // --- Buses ---
        if (q.contains("bus") || q.contains("coach") || q.contains("volvo")) {
            return "🚌 Booking a Bus on Bookzy:\n" +
                   "1. Click 'Travel' → 'Buses' from the top menu.\n" +
                   "2. Enter your departure and destination city.\n" +
                   "3. Select your travel date.\n" +
                   "4. Pick an operator (AC, Sleeper, Volvo, etc.) and book.\n\nBus seats are confirmed instantly on payment!";
        }

        // --- Hotels ---
        if (q.contains("hotel") || q.contains("room") || q.contains("stay") || q.contains("accommodation") || q.contains("check-in") || q.contains("check-out") || q.contains("checkout") || q.contains("checkin")) {
            return "🏨 Booking a Hotel on Bookzy:\n" +
                   "1. Click 'Hotels' from the top navigation bar.\n" +
                   "2. Enter your destination city.\n" +
                   "3. Select check-in and check-out dates.\n" +
                   "4. Choose room type (Standard, Deluxe, Suite).\n" +
                   "5. Pick a hotel and click 'Book Now'.\n\nYou'll receive a hotel confirmation with your booking ID!";
        }

        // --- Shows / Movies ---
        if (q.contains("show") || q.contains("movie") || q.contains("cinema") || q.contains("concert") || q.contains("event") || q.contains("ticket")) {
            return "🎬 Booking Shows & Movies on Bookzy:\n" +
                   "1. Click 'Shows' from the top navigation bar.\n" +
                   "2. Browse available movies and live events.\n" +
                   "3. Select your preferred showtime and number of tickets.\n" +
                   "4. Click 'Book Now' to confirm.\n\nYour ticket will appear in 'My Bookings' right away!";
        }

        // --- My Bookings ---
        if (q.contains("my booking") || q.contains("view booking") || q.contains("booking history") || q.contains("past booking") || q.contains("booked")) {
            return "📋 To view your bookings:\n" +
                   "1. Make sure you are logged in.\n" +
                   "2. Click your name / profile icon at the top.\n" +
                   "3. Select 'My Bookings' from the dropdown.\n" +
                   "4. You can filter bookings by type: Flights, Trains, Buses, Hotels, or Shows.\n\nAll your upcoming and past bookings are listed there!";
        }

        // --- Cancellation ---
        if (q.contains("cancel") && !q.contains("refund")) {
            return "❌ To cancel a booking:\n" +
                   "1. Go to 'My Bookings' from your profile.\n" +
                   "2. Find the booking you want to cancel.\n" +
                   "3. Click 'Cancel Booking'.\n" +
                   "4. Confirm the cancellation.\n\nCancellation charges may apply depending on the type of booking and how close it is to the travel date.";
        }

        // --- Refunds ---
        if (q.contains("refund") || q.contains("money back") || q.contains("reimburs")) {
            return "💰 Refund Policy on Bookzy:\n" +
                   "• Refunds are processed automatically after a successful cancellation.\n" +
                   "• For card/net banking payments: 3–5 business days.\n" +
                   "• For UPI payments: within 24–48 hours.\n" +
                   "• Refund amount depends on cancellation policy (some bookings are non-refundable).\n\nContact support if your refund hasn't arrived after 7 days.";
        }

        // --- Payments ---
        if (q.contains("payment") || q.contains("pay") || q.contains("upi") || q.contains("card") || q.contains("net banking") || q.contains("gpay") || q.contains("phonepe")) {
            return "💳 Payment Methods accepted on Bookzy:\n" +
                   "• Credit/Debit Cards (Visa, Mastercard, RuPay)\n" +
                   "• Net Banking (all major banks)\n" +
                   "• UPI (Google Pay, PhonePe, Paytm, BHIM)\n\nPayments are fully secured using SSL encryption. We do not store your card details.";
        }

        // --- Payment Failed ---
        if ((q.contains("payment") && (q.contains("fail") || q.contains("failed") || q.contains("not done") || q.contains("unsuccessful"))) || q.contains("transaction failed")) {
            return "⚠️ If your payment failed:\n" +
                   "1. Check if the amount was debited from your account.\n" +
                   "2. If debited but booking not confirmed — it will auto-refund in 3–5 days.\n" +
                   "3. Try booking again with a different payment method.\n" +
                   "4. If the issue persists, contact us via the 'Contact Us' page with your transaction ID.";
        }

        // --- WhatsApp Notifications ---
        if (q.contains("whatsapp") || q.contains("notification") || q.contains("sms") || q.contains("alert") || q.contains("message")) {
            return "📱 Bookzy WhatsApp Notifications:\n" +
                   "• You receive automatic WhatsApp confirmations after every booking.\n" +
                   "• Reminders are sent before your travel date.\n" +
                   "• Make sure your registered phone number is correct in your profile.\n\nUpdate your phone number in 'My Profile' → 'Edit Profile'.";
        }

        // --- Profile / Account ---
        if (q.contains("profile") || q.contains("account") || q.contains("edit") || q.contains("update details") || q.contains("change name") || q.contains("change email")) {
            return "👤 Managing Your Profile:\n" +
                   "1. Log in and click your name at the top-right.\n" +
                   "2. Select 'My Profile'.\n" +
                   "3. Click 'Edit Profile' to update your name, phone, or email.\n" +
                   "4. Save changes.\n\nNote: Email changes may require re-verification.";
        }

        // --- Offers / Discounts ---
        if (q.contains("offer") || q.contains("discount") || q.contains("coupon") || q.contains("promo") || q.contains("deal") || q.contains("cashback")) {
            return "🎁 Bookzy Offers & Discounts:\n" +
                   "• Visit the 'Offers' page from the top navigation for current deals.\n" +
                   "• Special discounts are available for first-time bookings.\n" +
                   "• Seasonal offers are announced on the homepage.\n\nKeep checking the Offers page for the latest deals!";
        }

        // --- Security / Data Safety ---
        if (q.contains("secure") || q.contains("security") || q.contains("data") || q.contains("privacy") || q.contains("safe")) {
            return "🔒 Your data is completely safe on Bookzy:\n" +
                   "• All data is stored in an encrypted MySQL database.\n" +
                   "• We use JWT (JSON Web Tokens) for secure session management.\n" +
                   "• Passwords are hashed and never stored in plain text.\n" +
                   "• Payments are processed over SSL-encrypted channels.\n\nWe never share your data with third parties.";
        }

        // --- Customer Support / Contact ---
        if (q.contains("support") || q.contains("contact") || q.contains("human") || q.contains("agent") || q.contains("helpdesk") || q.contains("speak to")) {
            return "📞 Need more help? Contact Bookzy Support:\n" +
                   "• Click 'About Us' → 'Contact Us' in the navigation.\n" +
                   "• Fill out the form with your name, email, and message.\n" +
                   "• Our team will respond within 24 hours.\n\nFor urgent issues, describe your problem in detail so we can help faster!";
        }

        // --- Technical Issues ---
        if (q.contains("error") || q.contains("bug") || q.contains("not working") || q.contains("issue") || q.contains("problem") || q.contains("crash") || q.contains("loading")) {
            return "🛠️ Facing a technical issue? Try these steps:\n" +
                   "1. Refresh the page (Ctrl+R or Cmd+R).\n" +
                   "2. Clear your browser cache and cookies.\n" +
                   "3. Try a different browser (Chrome/Firefox recommended).\n" +
                   "4. Make sure you have a stable internet connection.\n\nIf the issue persists, contact us via the 'Contact Us' page with a screenshot of the error.";
        }

        // --- Seat Availability ---
        if (q.contains("seat") || q.contains("available") || q.contains("availability") || q.contains("full") || q.contains("sold out")) {
            return "💺 Seat & Availability Info:\n" +
                   "• Search results show real-time seat availability.\n" +
                   "• If a train/bus/flight shows 0 seats, it is fully booked.\n" +
                   "• Try selecting a different date or class.\n" +
                   "• Hotel room availability is updated live from our database.";
        }

        // --- How to search ---
        if (q.contains("how to search") || q.contains("search") || (q.contains("find") && (q.contains("train") || q.contains("flight") || q.contains("bus") || q.contains("hotel")))) {
            return "🔍 How to search on Bookzy:\n" +
                   "1. Select the category from the top menu (Trains/Flights/Buses/Hotels/Shows).\n" +
                   "2. Enter your origin, destination, and travel date.\n" +
                   "3. Click the 'Search' button.\n" +
                   "4. Results will be listed with pricing, availability, and options to book.\n\nUse filters to sort by price, rating, or departure time!";
        }

        // --- Gratitude ---
        if (q.contains("thank") || q.contains("thanks") || q.contains("appreciate") || q.contains("great") || q.contains("awesome")) {
            return "😊 You're very welcome! Happy to help. Have a wonderful journey with Bookzy! If you need anything else, just ask.";
        }

        // --- Goodbye ---
        if (q.contains("bye") || q.contains("goodbye") || q.contains("see you") || q.contains("done")) {
            return "👋 Goodbye! Have a safe and enjoyable trip. Come back to Bookzy anytime — we're always here to help! ✈️🚂🏨";
        }

        // --- Default ---
        return "🤔 I'm not sure about that specific query. Here's what I can help you with:\n" +
               "• Booking: Trains, Flights, Buses, Hotels, Shows\n" +
               "• Cancellations & Refunds\n" +
               "• Payment methods\n" +
               "• Account & profile management\n" +
               "• WhatsApp notifications\n" +
               "• Technical issues\n\n" +
               "You can also visit our 'Contact Us' page for human support!";
    }
}
