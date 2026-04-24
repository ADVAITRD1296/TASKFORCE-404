package com.taskforce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlightBookingRequest {
    private Long flightId;
    private Integer passengers;
    private String classType;
}
