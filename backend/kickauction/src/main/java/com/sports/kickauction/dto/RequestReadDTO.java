package com.sports.kickauction.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestReadDTO {
    private int ono;
    private String playType;
    private String olocation;
    private LocalDateTime rentalDate;
    private LocalDateTime oregdate;
    private String rentaltime;
    private String otitle; 
}
