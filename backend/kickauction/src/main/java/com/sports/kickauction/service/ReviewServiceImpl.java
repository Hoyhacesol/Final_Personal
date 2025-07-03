package com.sports.kickauction.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.dto.SellerReviewReadDTO;
import com.sports.kickauction.entity.Review;
import com.sports.kickauction.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public void registerReview(Long ono, Long mno, Integer rating, String rcontent) {
        Review review = Review.builder()
                .ono(ono) // 주문번호를 PK로
                .mno(mno) // 판매자 회원번호
                .rating(rating) // 평점
                .rcontent(rcontent)// 리뷰 내용
                .build();
        reviewRepository.save(review);
    }




    // Request >>>>>>>>>>>>>>>>>>>>>>>>>>>
    @Override
    @Transactional(readOnly = true)
    public ReviewDTO getReviewByOno(Long ono) {
        Review review = reviewRepository.findByOno(ono)
                .orElseThrow(() -> new EntityNotFoundException("리뷰를 찾을 수 없습니다. ONO: " + ono));
        
        return ReviewDTO.builder()
                .ono(review.getOno())
                .rating(review.getRating())
                .rcontent(review.getRcontent())
                .build();
    }

    @Override
    public void updateReview(Long ono, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findByOno(ono)
                .orElseThrow(() -> new EntityNotFoundException("리뷰를 찾을 수 없습니다. ONO: " + ono));
        review.setRating(reviewDTO.getRating());
        review.setRcontent(reviewDTO.getRcontent());
        reviewRepository.save(review);
    }
}
