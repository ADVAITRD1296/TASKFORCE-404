package com.taskforce.backend.service;

import com.taskforce.backend.dto.UserProfileResponse;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toProfileResponse(user);
    }

    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toProfileResponse(user);
    }

    public UserProfileResponse updateProfile(Long userId, String name, String phone, String address, String dob) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (name != null && !name.isEmpty()) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (address != null) user.setAddress(address);
        if (dob != null && !dob.isEmpty()) user.setDob(LocalDate.parse(dob));

        userRepository.save(user);
        return toProfileResponse(user);
    }

    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dob(user.getDob())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
