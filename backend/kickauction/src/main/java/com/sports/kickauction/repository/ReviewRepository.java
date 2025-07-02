package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 1) 평균 평점 – r.mno 필드를 직접 사용
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.mno = :mno")
    Double findAvgRatingByMno(@Param("mno") Long mno);

    // 2) 리뷰 개수 – 메서드 이름만으로 가능
    Long countByMno(Long mno);

    // (선택) 특정 업체의 모든 리뷰가 필요하면
    List<Review> findBizMnoByOno(Long ono);
}
