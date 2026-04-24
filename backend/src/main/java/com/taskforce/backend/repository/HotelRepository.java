package com.taskforce.backend.repository;

import com.taskforce.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Optional<Hotel> findByName(String name);
    List<Hotel> findByLocationContainingIgnoreCase(String location);
    List<Hotel> findByRoomTypeContainingIgnoreCase(String roomType);
    List<Hotel> findByLocationContainingIgnoreCaseAndRoomTypeContainingIgnoreCase(String location, String roomType);
}
