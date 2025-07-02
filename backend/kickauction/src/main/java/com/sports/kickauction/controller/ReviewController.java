package com.sports.kickauction.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.service.BizService;
import com.sports.kickauction.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
     private final BizService bizService;
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Void> createReview(@RequestBody ReviewDTO dto) {
        // ① BizService를 통해 mno 조회
        Long sellerMno = bizService.getSellerMnoByOrderOno(dto.getOno());

        // ② 조회된 mno로 리뷰 저장
        reviewService.registerReview(
            dto.getOno(),
            sellerMno,
            dto.getRating(),
            dto.getRcontent()
        );

        return ResponseEntity.ok().build();
    }

}
