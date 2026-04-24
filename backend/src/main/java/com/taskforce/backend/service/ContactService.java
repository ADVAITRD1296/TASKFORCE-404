package com.taskforce.backend.service;

import com.taskforce.backend.entity.ContactMessage;
import com.taskforce.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage saveMessage(String name, String email, String message) {
        ContactMessage contactMessage = ContactMessage.builder()
                .name(name)
                .email(email)
                .message(message)
                .build();
        return contactMessageRepository.save(contactMessage);
    }
}
