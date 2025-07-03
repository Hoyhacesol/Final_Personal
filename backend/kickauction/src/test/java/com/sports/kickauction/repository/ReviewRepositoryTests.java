package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Review;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Log4j2
@Transactional
@Rollback(false)
public class ReviewRepositoryTests {

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    public void insert10Reviews() {
        Review r1 = Review.builder()
                .ono(1L)
                .mno(2L)
                .rating(5)
                .rcontent("장비 상태가 정말 좋았어요. 다음에도 또 이용하겠습니다!")
                .build();
        reviewRepository.save(r1);
        log.info("Saved review ono=1: {}", r1.getOno());

        Review r2 = Review.builder()
                .ono(2L)
                .mno(3L)
                .rating(4)
                .rcontent("친절한 응대에 만족합니다만, 배달이 조금 늦었어요.")
                .build();
        reviewRepository.save(r2);
        log.info("Saved review ono=2: {}", r2.getOno());

        Review r3 = Review.builder()
                .ono(3L)
                .mno(1L)
                .rating(3)
                .rcontent("가격은 괜찮은데 장비에 스크래치가 좀 있었네요.")
                .build();
        reviewRepository.save(r3);
        log.info("Saved review ono=3: {}", r3.getOno());

        Review r4 = Review.builder()
                .ono(4L)
                .mno(5L)
                .rating(5)
                .rcontent("예약부터 반납까지 전 과정이 매끄러웠습니다.")
                .build();
        reviewRepository.save(r4);
        log.info("Saved review ono=4: {}", r4.getOno());

        Review r5 = Review.builder()
                .ono(5L)
                .mno(4L)
                .rating(2)
                .rcontent("공기압이 너무 낮아서 직접 보충해야 했어요.")
                .build();
        reviewRepository.save(r5);
        log.info("Saved review ono=5: {}", r5.getOno());

        Review r6 = Review.builder()
                .ono(6L)
                .mno(2L)
                .rating(4)
                .rcontent("대여료 대비 장비 품질이 좋았습니다.")
                .build();
        reviewRepository.save(r6);
        log.info("Saved review ono=6: {}", r6.getOno());

        Review r7 = Review.builder()
                .ono(7L)
                .mno(3L)
                .rating(5)
                .rcontent("친구들과 재미있게 잘 사용했어요!")
                .build();
        reviewRepository.save(r7);
        log.info("Saved review ono=7: {}", r7.getOno());

        Review r8 = Review.builder()
                .ono(8L)
                .mno(6L)
                .rating(3)
                .rcontent("사이트 UI는 좋지만 결제 과정에서 오류가 있었어요.")
                .build();
        reviewRepository.save(r8);
        log.info("Saved review ono=8: {}", r8.getOno());

        Review r9 = Review.builder()
                .ono(9L)
                .mno(7L)
                .rating(4)
                .rcontent("장비 수거가 빨라서 일정 관리하기 편했어요.")
                .build();
        reviewRepository.save(r9);
        log.info("Saved review ono=9: {}", r9.getOno());

        Review r10 = Review.builder()
                .ono(10L)
                .mno(8L)
                .rating(5)
                .rcontent("전체적으로 완벽했습니다. 강력 추천합니다!")
                .build();
        reviewRepository.save(r10);
        log.info("Saved review ono=10: {}", r10.getOno());
    }
}
