package com.taskforce.backend.repository;

import com.taskforce.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);
    Optional<Flight> findByExternalId(String externalId);
    List<Flight> findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(String origin, String destination);
    List<Flight> findByOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(String origin, String destination);
}
