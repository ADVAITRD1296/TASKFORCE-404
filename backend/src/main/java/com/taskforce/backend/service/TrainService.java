package com.taskforce.backend.service;

import com.taskforce.backend.entity.Train;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.TrainRepository;
import com.taskforce.backend.repository.BookingRepository;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrainService {

    private final TrainRepository trainRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ExternalApiService apiService;
    private final FirebaseService firebaseService;
    private final WhatsAppService whatsAppService;

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public List<Train> searchTrains(String origin, String destination) {
        List<Train> dbTrains = trainRepository.findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(
            origin != null ? origin : "",
            destination != null ? destination : ""
        );

        if (dbTrains.isEmpty() && (origin != null || destination != null)) {
            List<Train> apiTrains = apiService.fetchTrains(origin, destination);
            if (!apiTrains.isEmpty()) {
                trainRepository.saveAll(apiTrains);
                return apiTrains;
            }
        }
        return dbTrains;
    }

    public Train getTrainById(Long id) {
        return trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id: " + id));
    }

    public Booking bookTrain(Long userId, Long trainId, Integer passengers, String classType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));

        if (train.getAvailableSeats() < passengers) {
            throw new BadRequestException("Not enough seats available");
        }

        train.setAvailableSeats(train.getAvailableSeats() - passengers);
        trainRepository.save(train);

        String details = String.format("%s (%s) | %s → %s | Passengers: %d | Class: %s",
                train.getTrainName(), train.getTrainNumber(),
                train.getOrigin(), train.getDestination(),
                passengers, classType != null ? classType : train.getClassType());

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(BookingType.TRAIN)
                .bookingReference("TR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .details(details)
                .totalPrice(train.getPrice() * passengers)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Firebase push notification
        if (user.getDeviceTokens() != null) {
            for (String token : user.getDeviceTokens()) {
                firebaseService.sendPushNotification(token,
                    "Train Booking Confirmed!",
                    "Your train ticket " + savedBooking.getBookingReference() + " is confirmed.");
            }
        }

        // WhatsApp confirmation
        whatsAppService.sendTrainBookingConfirmation(
            user.getName(), user.getPhone(),
            savedBooking.getBookingReference(), details, savedBooking.getTotalPrice()
        );

        return savedBooking;
    }
}
