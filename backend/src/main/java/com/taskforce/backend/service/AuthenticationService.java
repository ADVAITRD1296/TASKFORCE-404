package com.taskforce.backend.service;

import com.taskforce.backend.dto.AuthRequest;
import com.taskforce.backend.dto.AuthResponse;
import com.taskforce.backend.dto.RegisterRequest;
import com.taskforce.backend.entity.Role;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final WhatsAppService whatsAppService;

    public AuthResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already in use");
        }
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .dob(request.getDob() != null && !request.getDob().isEmpty() ? LocalDate.parse(request.getDob()) : null)
                .address(request.getAddress())
                .role(Role.USER)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);

        // Send WhatsApp Welcome Message on registration
        whatsAppService.sendRegistrationNotification(user.getName(), user.getPhone());

        return AuthResponse.builder()
                .token(jwtToken)
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Device Control Logic
        if (request.getDeviceToken() != null && !request.getDeviceToken().isEmpty()) {
            if (user.getDeviceTokens() == null) {
                user.setDeviceTokens(new ArrayList<>());
            }
            if (!user.getDeviceTokens().contains(request.getDeviceToken())) {
                if (user.getDeviceTokens().size() >= 2) {
                    throw new BadRequestException("Maximum device limit reached (2). Please log out from another device to continue.");
                }
                user.getDeviceTokens().add(request.getDeviceToken());
                repository.save(user);
            }
        }

        var jwtToken = jwtService.generateToken(user);

        // Send WhatsApp Login Alert
        whatsAppService.sendLoginNotification(user.getEmail(), user.getName(), user.getPhone());

        return AuthResponse.builder()
                .token(jwtToken)
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }

    public void logout(User user, String deviceToken) {
        if (deviceToken != null && user.getDeviceTokens() != null) {
            user.getDeviceTokens().remove(deviceToken);
            repository.save(user);
        }
    }
}
