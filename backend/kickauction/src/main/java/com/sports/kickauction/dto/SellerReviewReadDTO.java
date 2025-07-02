package com.sports.kickauction.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerReviewReadDTO {
    private Long mno;              // 업체 번호
    private int rating;            // 별점 (예: 8 → 4.0점)
    private String rcontent;       // 리뷰 내용
    private LocalDateTime regdate; // 등록일
}
