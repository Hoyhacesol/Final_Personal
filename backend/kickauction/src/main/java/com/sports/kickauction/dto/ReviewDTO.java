package com.sports.kickauction.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewDTO {
    private Long ono;
    private Long mno;
    private Integer rating;
    private String rcontent;
    // rregdate는 서버에서 자동 세팅
}
