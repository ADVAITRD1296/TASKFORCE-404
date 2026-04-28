package com.taskforce.backend.controller;

import com.taskforce.backend.entity.Bus;
import com.taskforce.backend.service.BusService;
import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Bus>> searchBuses(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination
    ) {
        return ResponseEntity.ok(busService.searchBuses(origin, destination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookBus(
            @AuthenticationPrincipal User user,
            @RequestBody com.taskforce.backend.dto.BusBookingRequest request
    ) {
        Booking booking = busService.bookBus(user.getId(), request.getBusId(), request.getSeats());
        return ResponseEntity.ok(BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .bookingType(booking.getBookingType().name())
                .details(booking.getDetails())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build());
    }
}
