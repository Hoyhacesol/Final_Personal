package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Comment;
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
public class CommentRepositoryTests {

    @Autowired
    private CommentRepository commentRepository;

    @Test
    public void insert10Comments() {
        Comment c1 = Comment.builder()
                .pno(1L)
                .mno(1L)
                .content("주말 시간대 저도 궁금했는데, 답변 감사합니다!")
                .build();
        commentRepository.save(c1);
        log.info("Saved cno1: {}", c1.getCno());

        Comment c2 = Comment.builder()
                .pno(2L)
                .mno(2L)
                .content("저는 아이가 사용하려고 하는데, 어떤 사이즈가 좋을까요?")
                .build();
        commentRepository.save(c2);
        log.info("Saved cno2: {}", c2.getCno());

        Comment c3 = Comment.builder()
                .pno(3L)
                .mno(3L)
                .content("교환 절차 간단하네요, 안내해 주셔서 감사해요.")
                .build();
        commentRepository.save(c3);
        log.info("Saved cno3: {}", c3.getCno());

        Comment c4 = Comment.builder()
                .pno(4L)
                .mno(4L)
                .content("입찰 취소는 마이페이지에서 바로 가능합니다.")
                .build();
        commentRepository.save(c4);
        log.info("Saved cno4: {}", c4.getCno());

        Comment c5 = Comment.builder()
                .pno(5L)
                .mno(5L)
                .content("연장 요금은 시간당 2,000원 부과됩니다.")
                .build();
        commentRepository.save(c5);
        log.info("Saved cno5: {}", c5.getCno());

        Comment c6 = Comment.builder()
                .pno(6L)
                .mno(1L)
                .content("공기 주입기 대여도 가능한지 문의드립니다.")
                .build();
        commentRepository.save(c6);
        log.info("Saved cno6: {}", c6.getCno());

        Comment c7 = Comment.builder()
                .pno(7L)
                .mno(2L)
                .content("환불 규정은 약관 5조를 참고해주세요.")
                .build();
        commentRepository.save(c7);
        log.info("Saved cno7: {}", c7.getCno());

        Comment c8 = Comment.builder()
                .pno(8L)
                .mno(3L)
                .content("골드 등급 무료 배송 혜택도 포함되어 있어요.")
                .build();
        commentRepository.save(c8);
        log.info("Saved cno8: {}", c8.getCno());

        Comment c9 = Comment.builder()
                .pno(9L)
                .mno(4L)
                .content("XX 구장 바닥 상태 정말 좋습니다!")
                .build();
        commentRepository.save(c9);
        log.info("Saved cno9: {}", c9.getCno());

        Comment c10 = Comment.builder()
                .pno(10L)
                .mno(5L)
                .content("파손 보험 옵션도 있으니 참고하세요.")
                .build();
        commentRepository.save(c10);
        log.info("Saved cno10: {}", c10.getCno());
          Comment c11 = Comment.builder()
                .pno(11L)
                .mno(1L)
                .content("주말 시간대 저도 궁금했는데, 답변 감사합니다!")
                .build();
        commentRepository.save(c11);
        log.info("Saved cno1: {}", c1.getCno());

        Comment c12 = Comment.builder()
                .pno(12L)
                .mno(2L)
                .content("저는 아이가 사용하려고 하는데, 어떤 사이즈가 좋을까요?")
                .build();
        commentRepository.save(c12);
        log.info("Saved cno2: {}", c2.getCno());

        Comment c13 = Comment.builder()
                .pno(13L)
                .mno(3L)
                .content("교환 절차 간단하네요, 안내해 주셔서 감사해요.")
                .build();
        commentRepository.save(c13);
        log.info("Saved cno3: {}", c3.getCno());

        Comment c14 = Comment.builder()
                .pno(14L)
                .mno(4L)
                .content("입찰 취소는 마이페이지에서 바로 가능합니다.")
                .build();
        commentRepository.save(c14);
        log.info("Saved cno4: {}", c4.getCno());

        Comment c15 = Comment.builder()
                .pno(15L)
                .mno(5L)
                .content("연장 요금은 시간당 2,000원 부과됩니다.")
                .build();
        commentRepository.save(c15);
        log.info("Saved cno5: {}", c5.getCno());

        Comment c16 = Comment.builder()
                .pno(16L)
                .mno(1L)
                .content("공기 주입기 대여도 가능한지 문의드립니다.")
                .build();
        commentRepository.save(c16);
        log.info("Saved cno6: {}", c6.getCno());

        Comment c17 = Comment.builder()
                .pno(17L)
                .mno(2L)
                .content("환불 규정은 약관 5조를 참고해주세요.")
                .build();
        commentRepository.save(c17);
        log.info("Saved cno7: {}", c7.getCno());

        Comment c18 = Comment.builder()
                .pno(18L)
                .mno(3L)
                .content("골드 등급 무료 배송 혜택도 포함되어 있어요.")
                .build();
        commentRepository.save(c18);
        log.info("Saved cno8: {}", c8.getCno());

        Comment c19 = Comment.builder()
                .pno(19L)
                .mno(4L)
                .content("XX 구장 바닥 상태 정말 좋습니다!")
                .build();
        commentRepository.save(c19);
        log.info("Saved cno9: {}", c9.getCno());

        Comment c20 = Comment.builder()
                .pno(20L)
                .mno(5L)
                .content("파손 보험 옵션도 있으니 참고하세요.")
                .build();
        commentRepository.save(c20);
        log.info("Saved cno10: {}", c10.getCno());
    }
    
}
