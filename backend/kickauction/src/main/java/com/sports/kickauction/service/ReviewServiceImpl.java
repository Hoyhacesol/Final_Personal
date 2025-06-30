package com.sports.kickauction.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.entity.Review;
import com.sports.kickauction.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository repo;

    @Override
    public void register(ReviewDTO dto) {
        Review review = Review.builder()
            .ono(dto.getOno())
            .mno(dto.getMno())
            .rating(dto.getRating())
            .rcontent(dto.getRcontent())
            .build();
        repo.save(review);
    }
}
