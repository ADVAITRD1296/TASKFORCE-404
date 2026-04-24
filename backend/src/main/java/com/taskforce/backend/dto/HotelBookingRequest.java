package com.taskforce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelBookingRequest {
    private Long hotelId;
    private String checkin;
    private String checkout;
    private String guests;
    private String roomType;
}
