package com.taskforce.backend.config;

import com.taskforce.backend.entity.Train;
import com.taskforce.backend.entity.Bus;
import com.taskforce.backend.entity.Flight;
import com.taskforce.backend.entity.Hotel;
import com.taskforce.backend.entity.Show;
import com.taskforce.backend.repository.FlightRepository;
import com.taskforce.backend.repository.HotelRepository;
import com.taskforce.backend.repository.ShowRepository;
import com.taskforce.backend.repository.TrainRepository;
import com.taskforce.backend.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;
    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private ShowRepository showRepository;
    @Autowired
    private TrainRepository trainRepository;
    @Autowired
    private BusRepository busRepository;

    @Override
    public void run(String... args) {
        seedFlights();
        seedHotels();
        seedShows();
        seedTrains();
        seedBuses();
    }

    private void seedFlights() {
        if (flightRepository.count() > 0) {
            log.info("Flights already seeded, skipping.");
            return;
        }
        log.info("Seeding flights...");
        
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

        flightRepository.save(Flight.builder()
            .airline("Vistara").flightNumber("UK-919").origin("New Delhi").destination("Mumbai")
            .departureTime(now.plusDays(3)).arrivalTime(now.plusDays(3).plusHours(2))
            .price(6100.0).availableSeats(40).classType("Premium Economy")
            .imageUrl("https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800")
            .build());

        flightRepository.save(Flight.builder()
            .airline("SpiceJet").flightNumber("SG-145").origin("Mumbai").destination("Goa")
            .departureTime(now.plusDays(1).plusHours(5)).arrivalTime(now.plusDays(1).plusHours(6).plusMinutes(30))
            .price(3500.0).availableSeats(12).classType("Economy")
            .imageUrl("https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800")
            .build());

        flightRepository.save(Flight.builder()
            .airline("Air India").flightNumber("AI-302").origin("Bengaluru").destination("Mumbai")
            .departureTime(now.plusDays(4)).arrivalTime(now.plusDays(4).plusHours(1).plusMinutes(45))
            .price(4800.0).availableSeats(25).classType("Economy")
            .imageUrl("https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800")
            .build());
            
        log.info("Flights refreshed.");
    }

    private void seedHotels() {
        if (hotelRepository.count() > 0) {
            log.info("Hotels already seeded, skipping.");
            return;
        }
        log.info("Seeding hotels...");

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
        if (showRepository.count() > 0) {
            log.info("Shows already seeded, skipping.");
            return;
        }
        log.info("Seeding shows...");

        showRepository.save(Show.builder()
            .name("Inception").genre("Sci-Fi/Thriller").rating(8.8)
            .imageUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500")
            .summary("A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.")
            .price(250.0).availableSeats(200).build());

        showRepository.save(Show.builder()
            .name("Interstellar").genre("Sci-Fi/Adventure").rating(8.7)
            .imageUrl("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500")
            .summary("A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.")
            .price(200.0).availableSeats(180).build());

        showRepository.save(Show.builder()
            .name("Dune").genre("Sci-Fi/Drama").rating(8.0)
            .imageUrl("https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500")
            .summary("A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.")
            .price(180.0).availableSeats(150).build());

        showRepository.save(Show.builder()
            .name("Avatar").genre("Sci-Fi/Action").rating(7.9)
            .imageUrl("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500")
            .summary("A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.")
            .price(150.0).availableSeats(250).build());

        showRepository.save(Show.builder()
            .name("The Dark Knight").genre("Action/Crime").rating(9.0)
            .imageUrl("https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500")
            .summary("When the menace known as the Joker wreaks havoc on Gotham, Batman must face one of the greatest tests of his ability to fight injustice.")
            .price(300.0).availableSeats(160).build());

        showRepository.save(Show.builder()
            .name("Oppenheimer").genre("Drama/History").rating(8.5)
            .imageUrl("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500")
            .summary("The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.")
            .price(350.0).availableSeats(140).build());

        log.info("Shows refreshed.");
    }

    private void seedTrains() {
        if (trainRepository.count() > 0) {
            log.info("Trains already seeded, skipping.");
            return;
        }
        log.info("Seeding trains...");
        LocalDateTime now = LocalDateTime.now();

        trainRepository.save(Train.builder()
            .trainName("Rajdhani Express").trainNumber("12431").origin("New Delhi").destination("Mumbai")
            .departureTime(now.plusDays(1)).arrivalTime(now.plusDays(1).plusHours(16))
            .price(2800.0).availableSeats(45).classType("3A")
            .imageUrl("https://images.unsplash.com/photo-1532105956626-ce5e407b4975?w=800")
            .build());

        trainRepository.save(Train.builder()
            .trainName("Shatabdi Express").trainNumber("12002").origin("New Delhi").destination("Bhopal")
            .departureTime(now.plusDays(1).plusHours(6)).arrivalTime(now.plusDays(1).plusHours(14))
            .price(1200.0).availableSeats(80).classType("CC")
            .imageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800")
            .build());

        trainRepository.save(Train.builder()
            .trainName("Duronto Express").trainNumber("12213").origin("Chennai").destination("New Delhi")
            .departureTime(now.plusDays(2)).arrivalTime(now.plusDays(3))
            .price(3100.0).availableSeats(30).classType("2A")
            .imageUrl("https://images.unsplash.com/photo-1474487022152-52033878c96f?w=800")
            .build());

        trainRepository.save(Train.builder()
            .trainName("Gitanjali Express").trainNumber("12860").origin("Kolkata").destination("Mumbai")
            .departureTime(now.plusDays(1).plusHours(10)).arrivalTime(now.plusDays(2).plusHours(18))
            .price(1800.0).availableSeats(55).classType("SL")
            .imageUrl("https://images.unsplash.com/photo-1474487022152-52033878c96f?w=800")
            .build());

        log.info("Trains refreshed.");
    }

    private void seedBuses() {
        if (busRepository.count() > 0) {
            log.info("Buses already seeded, skipping.");
            return;
        }
        log.info("Seeding buses...");
        LocalDateTime now = LocalDateTime.now();

        busRepository.save(Bus.builder()
            .operatorName("Zingbus").busType("AC Sleeper").origin("Delhi").destination("Manali")
            .departureTime(now.plusDays(1).plusHours(20)).arrivalTime(now.plusDays(2).plusHours(8))
            .price(1200.0).availableSeats(12)
            .imageUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800")
            .build());

        busRepository.save(Bus.builder()
            .operatorName("RedBus").busType("Non-AC Seater").origin("Mumbai").destination("Pune")
            .departureTime(now.plusHours(4)).arrivalTime(now.plusHours(7))
            .price(450.0).availableSeats(30)
            .imageUrl("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800")
            .build());

        busRepository.save(Bus.builder()
            .operatorName("VRL Travels").busType("Multi-Axle Volvo").origin("Bengaluru").destination("Chennai")
            .departureTime(now.plusHours(22)).arrivalTime(now.plusDays(1).plusHours(5))
            .price(1100.0).availableSeats(15)
            .imageUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800")
            .build());

        busRepository.save(Bus.builder()
            .operatorName("Neeta Travels").busType("AC Sleeper").origin("Pune").destination("Ahmedabad")
            .departureTime(now.plusHours(18)).arrivalTime(now.plusDays(1).plusHours(6))
            .price(1500.0).availableSeats(8)
            .imageUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800")
            .build());

        log.info("Buses refreshed.");
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
