package com.taskforce.backend.repository;

import com.taskforce.backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    Optional<Show> findByName(String name);
    List<Show> findByGenreContainingIgnoreCase(String genre);
    List<Show> findByNameContainingIgnoreCase(String name);
}
