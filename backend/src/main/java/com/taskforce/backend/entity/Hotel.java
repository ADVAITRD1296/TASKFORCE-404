package com.taskforce.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    private Double rating;

    @Column(name = "price_per_night", nullable = false)
    private Double pricePerNight;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "room_type")
    private String roomType;

    @Column(length = 1000)
    private String description;

    @Column(name = "available_rooms")
    private Integer availableRooms;

    @Column(name = "external_id", unique = true)
    private String externalId;
}
