package com.taskforce.backend.controller;

import com.taskforce.backend.dto.UserProfileResponse;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(userService.getProfile(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> updates
    ) {
        return ResponseEntity.ok(userService.updateProfile(
                user.getId(),
                updates.get("name"),
                updates.get("phone"),
                updates.get("address"),
                updates.get("dob")
        ));
    }
}
