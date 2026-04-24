package com.taskforce.backend.controller;

import com.taskforce.backend.dto.FlightBookingRequest;
import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.Flight;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(flightService.getAllFlights());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination
    ) {
        return ResponseEntity.ok(flightService.searchFlights(origin, destination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookFlight(
            @AuthenticationPrincipal User user,
            @RequestBody FlightBookingRequest request
    ) {
        Booking booking = flightService.bookFlight(
                user.getId(),
                request.getFlightId(),
                request.getPassengers(),
                request.getClassType()
        );
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
