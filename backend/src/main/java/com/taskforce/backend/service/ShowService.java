package com.taskforce.backend.service;

import com.taskforce.backend.entity.Show;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.ShowRepository;
import com.taskforce.backend.repository.BookingRepository;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WhatsAppService whatsAppService;

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));
    }

    public Booking bookShow(Long userId, String movieName, Integer tickets, String showtime, Double pricePerTicket) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (tickets == null || tickets < 1) {
            throw new BadRequestException("At least 1 ticket is required");
        }

        double price = pricePerTicket != null ? pricePerTicket : 250.0;
        double totalPrice = price * tickets;

        String details = String.format("Movie: %s | Tickets: %d | Showtime: %s | Price/ticket: ₹%.0f",
                movieName != null ? movieName : "Unknown", tickets, showtime != null ? showtime : "N/A", price);

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(BookingType.SHOW)
                .bookingReference("SH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .details(details)
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // WhatsApp confirmation
        whatsAppService.sendShowBookingConfirmation(
            user.getName(), user.getPhone(),
            savedBooking.getBookingReference(), details, savedBooking.getTotalPrice()
        );

        return savedBooking;
    }
}
