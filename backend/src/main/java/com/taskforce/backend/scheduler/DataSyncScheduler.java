package com.taskforce.backend.scheduler;

import com.taskforce.backend.entity.*;
import com.taskforce.backend.repository.*;
import com.taskforce.backend.service.ExternalApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSyncScheduler {

    private final ExternalApiService apiService;
    private final HotelRepository hotelRepository;
    private final FlightRepository flightRepository;
    private final TrainRepository trainRepository;
    private final BusRepository busRepository;
    private final ShowRepository showRepository;

    // Sync every 6 hours
    @Scheduled(fixedRate = 21600000)
    public void syncAllData() {
        log.info("Starting scheduled data synchronization from RapidAPI...");
        syncHotels();
        syncFlights();
        syncTrains();
        syncBuses();
        log.info("Data synchronization completed.");
    }

    private void syncHotels() {
        try {
            // Default sync for major city
            List<Hotel> hotels = apiService.fetchHotels("Mumbai");
            saveHotels(hotels);
        } catch (Exception e) {
            log.error("Error syncing hotels: {}", e.getMessage());
        }
    }

    private void syncFlights() {
        try {
            List<Flight> flights = apiService.fetchFlights("DEL", "BOM");
            saveFlights(flights);
        } catch (Exception e) {
            log.error("Error syncing flights: {}", e.getMessage());
        }
    }

    private void syncTrains() {
        try {
            List<Train> trains = apiService.fetchTrains("NDLS", "BCT");
            saveTrains(trains);
        } catch (Exception e) {
            log.error("Error syncing trains: {}", e.getMessage());
        }
    }

    private void syncBuses() {
        try {
            List<Bus> buses = apiService.fetchBuses("Delhi", "Mumbai");
            saveBuses(buses);
        } catch (Exception e) {
            log.error("Error syncing buses: {}", e.getMessage());
        }
    }

    private void saveHotels(List<Hotel> hotels) {
        for (Hotel hotel : hotels) {
            hotelRepository.findByExternalId(hotel.getExternalId()).ifPresentOrElse(
                existing -> {
                    existing.setPricePerNight(hotel.getPricePerNight());
                    existing.setRating(hotel.getRating());
                    hotelRepository.save(existing);
                },
                () -> hotelRepository.save(hotel)
            );
        }
    }

    private void saveFlights(List<Flight> flights) {
        for (Flight flight : flights) {
            flightRepository.findByExternalId(flight.getExternalId()).ifPresentOrElse(
                existing -> {
                    existing.setPrice(flight.getPrice());
                    flightRepository.save(existing);
                },
                () -> flightRepository.save(flight)
            );
        }
    }

    private void saveTrains(List<Train> trains) {
        for (Train train : trains) {
            trainRepository.findByExternalId(train.getExternalId()).ifPresentOrElse(
                existing -> {
                    existing.setPrice(train.getPrice());
                    trainRepository.save(existing);
                },
                () -> trainRepository.save(train)
            );
        }
    }

    private void saveBuses(List<Bus> buses) {
        for (Bus bus : buses) {
            busRepository.findByExternalId(bus.getExternalId()).ifPresentOrElse(
                existing -> {
                    existing.setPrice(bus.getPrice());
                    busRepository.save(existing);
                },
                () -> busRepository.save(bus)
            );
        }
    }
}
