package com.taskforce.backend.service;

import com.taskforce.backend.entity.Bus;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.BusRepository;
import com.taskforce.backend.repository.BookingRepository;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ExternalApiService apiService;
    private final FirebaseService firebaseService;
    private final WhatsAppService whatsAppService;

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public List<Bus> searchBuses(String origin, String destination) {
        List<Bus> dbBuses = busRepository.findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(
            origin != null ? origin : "",
            destination != null ? destination : ""
        );

        if (dbBuses.isEmpty() && (origin != null || destination != null)) {
            List<Bus> apiBuses = apiService.fetchBuses(origin, destination);
            if (!apiBuses.isEmpty()) {
                busRepository.saveAll(apiBuses);
                return apiBuses;
            }
        }
        return dbBuses;
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
    }

    public Booking bookBus(Long userId, Long busId, Integer seats) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (bus.getAvailableSeats() < seats) {
            throw new BadRequestException("Not enough seats available");
        }

        bus.setAvailableSeats(bus.getAvailableSeats() - seats);
        busRepository.save(bus);

        String details = String.format("%s (%s) | %s → %s | Seats: %d",
                bus.getOperatorName(), bus.getBusType(),
                bus.getOrigin(), bus.getDestination(), seats);

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(BookingType.BUS)
                .bookingReference("BS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .details(details)
                .totalPrice(bus.getPrice() * seats)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Firebase push notification
        if (user.getDeviceTokens() != null) {
            for (String token : user.getDeviceTokens()) {
                firebaseService.sendPushNotification(token,
                    "Bus Booking Confirmed!",
                    "Your bus ticket " + savedBooking.getBookingReference() + " is confirmed.");
            }
        }

        // WhatsApp confirmation
        whatsAppService.sendBusBookingConfirmation(
            user.getName(), user.getPhone(),
            savedBooking.getBookingReference(), details, savedBooking.getTotalPrice()
        );

        return savedBooking;
    }
}
