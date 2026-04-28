package com.taskforce.backend.dto;

import lombok.Data;

@Data
public class BusBookingRequest {
    private Long busId;
    private Integer seats;
}
