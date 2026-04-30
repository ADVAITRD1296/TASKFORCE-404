package com.taskforce.backend.service;

import com.taskforce.backend.entity.Hotel;
import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import com.taskforce.backend.entity.BookingStatus;
import com.taskforce.backend.entity.User;
import com.taskforce.backend.exception.BadRequestException;
import com.taskforce.backend.exception.ResourceNotFoundException;
import com.taskforce.backend.repository.HotelRepository;
import com.taskforce.backend.repository.BookingRepository;
import com.taskforce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ExternalApiService apiService;
    private final FirebaseService firebaseService;
    private final WhatsAppService whatsAppService;

    @Cacheable(value = "hotels")
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotels(String location, String roomType) {
        List<Hotel> dbHotels = hotelRepository.findByLocationContainingIgnoreCaseAndRoomTypeContainingIgnoreCase(
            location != null ? location : "",
            roomType != null ? roomType : ""
        );

        if (dbHotels.isEmpty() && location != null) {
            List<Hotel> apiHotels = apiService.fetchHotels(location);
            if (!apiHotels.isEmpty()) {
                hotelRepository.saveAll(apiHotels);
                return apiHotels;
            }
        }
        return dbHotels;
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    @CacheEvict(value = "hotels", allEntries = true)
    public Booking bookHotel(Long userId, Long hotelId, String checkin, String checkout, String guests, String roomType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        if (hotel.getAvailableRooms() <= 0) {
            throw new BadRequestException("No rooms available at this hotel");
        }

        hotel.setAvailableRooms(hotel.getAvailableRooms() - 1);
        hotelRepository.save(hotel);

        String details = String.format("%s | %s | Check-in: %s | Check-out: %s | Guests: %s | Room: %s",
                hotel.getName(), hotel.getLocation(), checkin, checkout,
                guests != null ? guests : "1", roomType != null ? roomType : hotel.getRoomType());

        double totalPrice = hotel.getPricePerNight();

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(BookingType.HOTEL)
                .bookingReference("HT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .details(details)
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Firebase push notification
        if (user.getDeviceTokens() != null) {
            for (String token : user.getDeviceTokens()) {
                firebaseService.sendPushNotification(token,
                    "Hotel Booking Confirmed!",
                    "Your hotel booking " + savedBooking.getBookingReference() + " is confirmed.");
            }
        }

        // WhatsApp confirmation
        whatsAppService.sendHotelBookingConfirmation(
            user.getName(), user.getPhone(),
            savedBooking.getBookingReference(), details, savedBooking.getTotalPrice()
        );

        return savedBooking;
    }
}
