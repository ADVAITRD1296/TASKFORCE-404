package com.taskforce.backend.repository;

import com.taskforce.backend.entity.Booking;
import com.taskforce.backend.entity.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByUserIdAndBookingTypeOrderByCreatedAtDesc(Long userId, BookingType bookingType);
    Optional<Booking> findByBookingReference(String bookingReference);
    Optional<Booking> findByIdAndUserId(Long id, Long userId);
}
