package com.taskforce.backend.service;

import com.taskforce.backend.entity.Flight;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.FlightRepository;
import com.taskforce.backend.repository.BookingRepository;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ExternalApiService apiService;
    private final FirebaseService firebaseService;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public List<Flight> searchFlights(String origin, String destination) {
        List<Flight> dbFlights = flightRepository.findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(
            origin != null ? origin : "", 
            destination != null ? destination : ""
        );

        if (dbFlights.isEmpty() && (origin != null || destination != null)) {
            List<Flight> apiFlights = apiService.fetchFlights(origin, destination);
            if (!apiFlights.isEmpty()) {
                flightRepository.saveAll(apiFlights);
                return apiFlights;
            }
        }
        return dbFlights;
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    public Booking bookFlight(Long userId, Long flightId, Integer passengers, String classType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        if (flight.getAvailableSeats() < passengers) {
            throw new BadRequestException("Not enough seats available");
        }

        flight.setAvailableSeats(flight.getAvailableSeats() - passengers);
        flightRepository.save(flight);

        String details = String.format("%s (%s) | %s → %s | Passengers: %d | Class: %s",
                flight.getAirline(), flight.getFlightNumber(),
                flight.getOrigin(), flight.getDestination(),
                passengers, classType != null ? classType : flight.getClassType());

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(BookingType.FLIGHT)
                .bookingReference("FL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .details(details)
                .totalPrice(flight.getPrice() * passengers)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        if (user.getDeviceTokens() != null) {
            for (String token : user.getDeviceTokens()) {
                firebaseService.sendPushNotification(token, 
                    "Flight Booking Confirmed!", 
                    "Your flight ticket " + savedBooking.getBookingReference() + " is confirmed."
                );
            }
        }

        return savedBooking;
    }
}
