package com.taskforce.backend.controller;

import com.taskforce.backend.dto.ShowBookingRequest;
import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.Show;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookShow(
            @AuthenticationPrincipal User user,
            @RequestBody ShowBookingRequest request
    ) {
        Booking booking = showService.bookShow(
                user.getId(),
                request.getMovieName(),
                request.getTickets(),
                request.getShowtime(),
                request.getPricePerTicket()
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
