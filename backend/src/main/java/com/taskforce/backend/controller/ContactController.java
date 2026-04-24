package com.taskforce.backend.controller;

import com.taskforce.backend.dto.ContactRequest;
import com.taskforce.backend.entity.ContactMessage;
import com.taskforce.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Map<String, String>> submitContact(
            @RequestBody ContactRequest request
    ) {
        contactService.saveMessage(request.getName(), request.getEmail(), request.getMessage());
        return ResponseEntity.ok(Map.of("message", "Thank you! Your message has been received."));
    }
}
