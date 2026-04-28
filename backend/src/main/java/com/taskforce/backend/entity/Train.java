package com.taskforce.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trains")
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String trainName;

    @Column(name = "train_number", nullable = false)
    private String trainNumber;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(nullable = false)
    private Double price;

    @Column(name = "available_seats")
    private Integer availableSeats;

    @Column(name = "class_type")
    private String classType; // e.g., SL, 3A, 2A, 1A

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "external_id", unique = true)
    private String externalId; // ID from external API
}
