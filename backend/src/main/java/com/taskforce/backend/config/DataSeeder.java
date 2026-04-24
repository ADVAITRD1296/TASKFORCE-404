package com.taskforce.backend.config;

import com.taskforce.backend.entity.Flight;
import com.taskforce.backend.entity.Hotel;
import com.taskforce.backend.entity.Show;
import com.taskforce.backend.repository.FlightRepository;
import com.taskforce.backend.repository.HotelRepository;
import com.taskforce.backend.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final HotelRepository hotelRepository;
    private final ShowRepository showRepository;

    @Override
    public void run(String... args) {
        seedFlights();
        seedHotels();
        seedShows();
    }

    private void seedFlights() {
        log.info("Refreshing flights...");
        flightRepository.deleteAll();
        
        LocalDateTime now = LocalDateTime.now();

        flightRepository.save(Flight.builder()
            .airline("Air India").flightNumber("AI-101").origin("New Delhi").destination("Mumbai")
            .departureTime(now.plusDays(1)).arrivalTime(now.plusDays(1).plusHours(2))
            .price(4500.0).availableSeats(120).classType("Economy")
            .imageUrl("https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800")
            .build());

        flightRepository.save(Flight.builder()
            .airline("IndiGo").flightNumber("6E-204").origin("Bengaluru").destination("New Delhi")
            .departureTime(now.plusDays(2)).arrivalTime(now.plusDays(2).plusHours(3))
            .price(5200.0).availableSeats(180).classType("Economy")
            .imageUrl("https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800")
            .build());
            
        log.info("Flights refreshed.");
    }

    private void seedHotels() {
        log.info("Refreshing hotels...");
        hotelRepository.deleteAll();

        hotelRepository.save(Hotel.builder()
            .name("Sea View Resort").location("Goa, India").rating(4.7).pricePerNight(3999.0)
            .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800")
            .roomType("Deluxe Room").description("A stunning beachfront property with panoramic sea views.")
            .availableRooms(25).build());

        hotelRepository.save(Hotel.builder()
            .name("Skyline Grand").location("Mumbai, India").rating(4.6).pricePerNight(4499.0)
            .imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800")
            .roomType("Standard Room").description("Luxurious city hotel with rooftop dining and pool.")
            .availableRooms(40).build());

        log.info("Hotels refreshed.");
    }

    private void seedShows() {
        log.info("Refreshing shows...");
        showRepository.deleteAll();

        showRepository.save(Show.builder()
            .name("Inception").genre("Sci-Fi/Thriller").rating(8.8)
            .imageUrl("https://image.tmdb.org/t/p/w500/9gk7Fn9sVAsOX73qb1M6zLthQvX.jpg")
            .summary("A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.")
            .price(250.0).availableSeats(200).build());

        showRepository.save(Show.builder()
            .name("Interstellar").genre("Sci-Fi/Adventure").rating(8.7)
            .imageUrl("https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6vCU6mgQbpvCO.jpg")
            .summary("A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.")
            .price(200.0).availableSeats(180).build());

        showRepository.save(Show.builder()
            .name("Dune").genre("Sci-Fi/Drama").rating(8.0)
            .imageUrl("https://image.tmdb.org/t/p/w500/d5NXSklZfs7qyiooasHnfm6M1S1.jpg")
            .summary("A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.")
            .price(180.0).availableSeats(150).build());

        showRepository.save(Show.builder()
            .name("Avatar").genre("Sci-Fi/Action").rating(7.9)
            .imageUrl("https://image.tmdb.org/t/p/w500/6EiRUJTLs7FwZpbtZmQoq1ZQCp6.jpg")
            .summary("A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.")
            .price(150.0).availableSeats(250).build());

        log.info("Shows refreshed.");
    }

    private void updateOrCreateShow(String name, String genre, double rating, String url, String summary, double price, int seats) {
        showRepository.findByName(name).ifPresentOrElse(
            s -> {
                s.setImageUrl(url);
                s.setGenre(genre);
                s.setRating(rating);
                s.setSummary(summary);
                s.setPrice(price);
                showRepository.save(s);
            },
            () -> {
                showRepository.save(Show.builder()
                    .name(name).genre(genre).rating(rating)
                    .imageUrl(url).summary(summary)
                    .price(price).availableSeats(seats).build());
            }
        );
    }
}
