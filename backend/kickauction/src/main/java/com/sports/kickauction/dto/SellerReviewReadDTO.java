package com.sports.kickauction.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class SellerReviewReadDTO {
    private String username;       // 작성자 닉네임
    private int rating;            // 별점 (예: 8 → 4.0점)
    private String rcontent;       // 리뷰 내용
    private LocalDateTime regDate; // 등록일


    public SellerReviewReadDTO(String username, int rating, String rcontent, LocalDateTime regDate) {
        this.username = username;
        this.rating = rating;
        this.rcontent = rcontent;
        this.regDate = regDate;
    }
}
