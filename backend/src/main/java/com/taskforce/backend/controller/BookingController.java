package com.taskforce.backend.controller;

import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getUserBookings(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String type
    ) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(bookingService.getUserBookingsByType(user.getId(), type));
        }
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(user.getId(), id));
    }
}
