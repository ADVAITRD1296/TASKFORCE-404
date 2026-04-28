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
        // Try Groq first if key exists
        if (groqApiKey != null && !groqApiKey.isEmpty()) {
            try {
                return callGroqApi(question);
            } catch (Exception e) {
                log.warn("Groq API failed or is unauthorized. Falling back to Smart Support Engine.");
            }
        }
        
        // Use Smart Fallback Engine
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
        systemMessage.put("content", "You are the Bookzy Live Support Assistant. Be concise and helpful.");
        
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
        if (q == null || q.trim().isEmpty()) return "I'm sorry, I received an empty message.";
        q = q.toLowerCase();
        
        // Greetings
        if (q.matches(".*\\b(hello|hi|hey|greetings|morning|afternoon|evening)\\b.*")) {
            return "Hello! I am your Bookzy AI Assistant. I can help you with bookings, cancellations, payments, and account questions. How can I assist you today?";
        }
        
        // Cancellations & Refunds
        if (q.contains("cancel") || q.contains("refund") || q.contains("money back")) {
            return "To cancel a booking: 1. Go to your Dashboard. 2. Click 'My Bookings'. 3. Select the booking. 4. Click 'Cancel'. Refunds are typically processed to your original payment method within 3-5 business days.";
        }
        
        // Specific Booking Types (Trains, Flights, Buses, Hotels, Shows)
        if (q.contains("train") || q.contains("railway")) {
            return "To book a train: Click on the 'Trains' tab at the top, enter your origin and destination stations, select your travel date, and click Search. You can then select your preferred train and seat class.";
        }
        if (q.contains("flight") || q.contains("plane") || q.contains("air")) {
            return "To book a flight: Click on the 'Flights' tab, enter your departure and arrival airports, select your dates, and click Search. You can filter by airline and class type before booking.";
        }
        if (q.contains("bus") || q.contains("coach")) {
            return "To book a bus: Click on the 'Buses' tab, enter your departure city and destination, select your date, and hit Search. You'll see a list of operators and available seats.";
        }
        if (q.contains("hotel") || q.contains("room") || q.contains("stay")) {
            return "To book a hotel: Navigate to the 'Hotels' tab, enter the city you want to stay in, select your check-in and check-out dates, and click Search. You can choose from various room types.";
        }
        if (q.contains("show") || q.contains("movie") || q.contains("cinema") || q.contains("concert") || q.contains("event")) {
            return "To book a show or movie: Click on the 'Shows' tab in the navigation bar. Browse the available events or movies, select your preferred showtime, choose your tickets, and proceed to checkout.";
        }
        
        // General Booking
        if (q.contains("book") || q.contains("ticket") || q.contains("reserve")) {
            return "Booking is easy! Navigate to the respective section (Trains, Flights, Buses, Hotels, or Shows) from the top menu, enter your details, and click 'Search'. Once you find your preferred option, click 'Book Now'.";
        }
        
        // Data & Security
        if (q.contains("data saved") || (q.contains("where") && q.contains("save")) || q.contains("database") || q.contains("secure")) {
            return "Your data is strictly secured. Bookings are saved in our encrypted MySQL database, and we use JWT tokens for session security. You can view your data anytime on your Dashboard.";
        }
        
        // Payments
        if (q.contains("payment") || q.contains("pay") || q.contains("card") || q.contains("upi")) {
            return "We currently accept all major credit/debit cards, Net Banking, and UPI. The payment will be collected securely during the final confirmation step of your booking.";
        }
        
        // Support/Contact
        if (q.contains("support") || q.contains("contact") || q.contains("human") || q.contains("help") || q.contains("error") || q.contains("issue")) {
            return "If you need human assistance or are facing technical issues, please navigate to the 'Contact' page and fill out the form. Our support team will reach out via email within 24 hours.";
        }
        
        // Gratitude
        if (q.contains("thank") || q.contains("thanks")) {
            return "You're very welcome! Let me know if you need anything else. Have a great journey with Bookzy.";
        }
        
        // Default Fallback
        return "I'm sorry, I don't have the specific answer for that. You can ask me about how to book tickets (flights, trains, buses, shows, hotels), how to cancel bookings, or payment methods.";
    }
}
