package com.taskforce.backend.controller;

import com.taskforce.backend.dto.HotelBookingRequest;
import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.Hotel;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String roomType
    ) {
        return ResponseEntity.ok(hotelService.searchHotels(location, roomType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookHotel(
            @AuthenticationPrincipal User user,
            @RequestBody HotelBookingRequest request
    ) {
        Booking booking = hotelService.bookHotel(
                user.getId(),
                request.getHotelId(),
                request.getCheckin(),
                request.getCheckout(),
                request.getGuests(),
                request.getRoomType()
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
