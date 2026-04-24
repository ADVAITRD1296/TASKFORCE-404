package com.taskforce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private String bookingType;
    private String details;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
}
