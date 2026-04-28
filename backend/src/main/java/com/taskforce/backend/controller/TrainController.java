package com.taskforce.backend.controller;

import com.taskforce.backend.entity.Train;
import com.taskforce.backend.service.TrainService;
import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination
    ) {
        return ResponseEntity.ok(trainService.searchTrains(origin, destination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookTrain(
            @AuthenticationPrincipal User user,
            @RequestBody com.taskforce.backend.dto.TrainBookingRequest request
    ) {
        Booking booking = trainService.bookTrain(user.getId(), request.getTrainId(), request.getPassengers(), request.getClassType());
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
