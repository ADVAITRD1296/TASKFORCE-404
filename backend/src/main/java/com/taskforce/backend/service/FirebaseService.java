package com.taskforce.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;

@Service
@Slf4j
public class FirebaseService {

    @Value("${firebase.config.path:}")
    private String configPath;

    @PostConstruct
    public void init() {
        try {
            if (configPath != null && !configPath.isEmpty()) {
                FileInputStream serviceAccount = new FileInputStream(configPath);
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
                log.info("Firebase initialized successfully");
            } else {
                log.warn("Firebase config path not provided. FCM will be disabled.");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase", e);
        }
    }

    public void sendPushNotification(String token, String title, String body) {
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("Firebase not initialized. Simulating notification: {} - {}", title, body);
            return;
        }

        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent message: {}", response);
        } catch (Exception e) {
            log.error("Error sending FCM message", e);
        }
    }
}
