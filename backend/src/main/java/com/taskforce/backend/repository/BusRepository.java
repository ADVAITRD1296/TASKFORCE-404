package com.taskforce.backend.repository;

import com.taskforce.backend.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByExternalId(String externalId);
    List<Bus> findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(String origin, String destination);
}
