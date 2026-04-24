package com.taskforce.backend.service;

import com.taskforce.backend.dto.BookingResponse;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getUserBookingsByType(Long userId, String type) {
        BookingType bookingType = BookingType.valueOf(type.toUpperCase());
        return bookingRepository.findByUserIdAndBookingTypeOrderByCreatedAtDesc(userId, bookingType)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .bookingType(booking.getBookingType().name())
                .details(booking.getDetails())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
