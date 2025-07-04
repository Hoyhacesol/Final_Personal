package com.sports.kickauction.service;

import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.dto.SellerReviewReadDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ReviewService {
    /**
     * @param ono      주문번호 (PK)
     * @param mno      판매자 회원번호
     * @param rating   평점
     * @param rcontent 리뷰 내용
     */
    void registerReview(Long ono, Long mno, Integer rating, String rcontent);

    
    // Request >>>>>>>>>>>>>>>>>>>>>>>>>>>
    ReviewDTO getReviewByOno(Long ono);
    void updateReview(Long ono, ReviewDTO reviewDTO);

    Page<SellerReviewReadDTO> getReviewsBySeller(Long sellerMno, Pageable pageable);
}
