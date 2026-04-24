package com.taskforce.backend.controller;

import com.taskforce.backend.dto.AuthRequest;
import com.taskforce.backend.dto.AuthResponse;
import com.taskforce.backend.dto.RegisterRequest;
import com.taskforce.backend.dto.UserProfileResponse;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.AuthenticationService;
import com.taskforce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(userService.getProfileByEmail(user.getEmail()));
    }
}
