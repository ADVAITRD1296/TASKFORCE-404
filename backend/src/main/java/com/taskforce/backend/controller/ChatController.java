package com.taskforce.backend.controller;

import com.taskforce.backend.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final com.taskforce.backend.service.AiSupportService aiSupportService;

    public ChatController(com.taskforce.backend.service.AiSupportService aiSupportService) {
        this.aiSupportService = aiSupportService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, 
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/chat/ask")
    @org.springframework.web.bind.annotation.ResponseBody
    public java.util.Map<String, String> askAi(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        String question = payload.get("message");
        String answer = aiSupportService.getAnswer(question);
        
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("reply", answer);
        return response;
    }
}
