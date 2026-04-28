package com.taskforce.backend.dto;

import lombok.Data;

@Data
public class TrainBookingRequest {
    private Long trainId;
    private Integer passengers;
    private String classType;
}
