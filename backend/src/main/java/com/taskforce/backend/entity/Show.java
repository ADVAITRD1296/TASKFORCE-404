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
@Table(name = "shows")
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String genre;

    private Double rating;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(length = 2000)
    private String summary;

    @Column(nullable = false)
    private Double price;

    @Column(name = "available_seats")
    private Integer availableSeats;

    @Column(name = "external_id", unique = true)
    private String externalId;
}
