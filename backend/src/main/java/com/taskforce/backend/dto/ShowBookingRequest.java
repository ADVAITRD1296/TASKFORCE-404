package com.taskforce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowBookingRequest {
    private Long showId;
    private Integer tickets;
    private String showtime;
    private String movieName;
    private Double pricePerTicket;
}
