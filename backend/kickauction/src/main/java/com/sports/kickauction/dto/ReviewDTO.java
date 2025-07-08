package com.sports.kickauction.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewDTO {
    private Long ono;
    private Integer rating;
    private String rcontent;
}
    