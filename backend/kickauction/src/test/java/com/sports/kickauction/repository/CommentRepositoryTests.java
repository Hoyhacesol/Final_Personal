package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Comment;
import com.sports.kickauction.repository.CommentRepository;
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
    public void insertComments() {
        // pno 1 (3 comments)
        Comment c1 = Comment.builder()
                .pno(1L).mno(2L)
                .content("주말 오전 10시~12시 사이에도 예약 가능하다고 들었습니다.")
                .build();
        commentRepository.save(c1);
        log.info("Saved cno1: {}", c1.getCno());

        Comment c2 = Comment.builder()
                .pno(1L).mno(5L)
                .content("2시 이후에는 사람이 많으니 미리 예약하세요.")
                .build();
        commentRepository.save(c2);
        log.info("Saved cno2: {}", c2.getCno());

        Comment c3 = Comment.builder()
                .pno(1L).mno(9L)
                .content("주말 오후 시간은 인기가 많으니 빠른 예약이 좋아요.")
                .build();
        commentRepository.save(c3);
        log.info("Saved cno3: {}", c3.getCno());

        // pno 2 (2 comments)
        Comment c4 = Comment.builder()
                .pno(2L).mno(4L)
                .content("아디다스 키즈 축구공 추천드립니다, 내구성 좋아요.")
                .build();
        commentRepository.save(c4);
        log.info("Saved cno4: {}", c4.getCno());

        Comment c5 = Comment.builder()
                .pno(2L).mno(11L)
                .content("나이키 junior 모델이 가벼워서 아이가 사용하기 편해요.")
                .build();
        commentRepository.save(c5);
        log.info("Saved cno5: {}", c5.getCno());

        // pno 3 (4 comments)
        Comment c6 = Comment.builder()
                .pno(3L).mno(6L)
                .content("교환은 수령일로부터 7일 이내 가능합니다.")
                .build();
        commentRepository.save(c6);
        log.info("Saved cno6: {}", c6.getCno());

        Comment c7 = Comment.builder()
                .pno(3L).mno(14L)
                .content("배송비는 양쪽 모두 부담하셔야 합니다.")
                .build();
        commentRepository.save(c7);
        log.info("Saved cno7: {}", c7.getCno());

        Comment c8 = Comment.builder()
                .pno(3L).mno(2L)
                .content("반품 전 고객센터에 문의해 주세요.")
                .build();
        commentRepository.save(c8);
        log.info("Saved cno8: {}", c8.getCno());

        Comment c9 = Comment.builder()
                .pno(3L).mno(10L)
                .content("맞교환 서비스 이용하시면 편리합니다.")
                .build();
        commentRepository.save(c9);
        log.info("Saved cno9: {}", c9.getCno());

        // pno 4 (1 comment)
        Comment c10 = Comment.builder()
                .pno(4L).mno(8L)
                .content("역경매는 입찰가를 제시하고 최저가로 낙찰받는 방식입니다.")
                .build();
        commentRepository.save(c10);
        log.info("Saved cno10: {}", c10.getCno());

        // pno 5 (5 comments)
        Comment c11 = Comment.builder()
                .pno(5L).mno(1L)
                .content("연장은 대여 종료일 이전 24시간 내에 가능합니다.")
                .build();
        commentRepository.save(c11);
        log.info("Saved cno11: {}", c11.getCno());

        Comment c12 = Comment.builder()
                .pno(5L).mno(13L)
                .content("추가 요금은 1일당 3000원입니다.")
                .build();
        commentRepository.save(c12);
        log.info("Saved cno12: {}", c12.getCno());

        Comment c13 = Comment.builder()
                .pno(5L).mno(7L)
                .content("웹사이트에서 바로 연장 신청하세요.")
                .build();
        commentRepository.save(c13);
        log.info("Saved cno13: {}", c13.getCno());

        Comment c14 = Comment.builder()
                .pno(5L).mno(15L)
                .content("최대 연장 기간은 3일입니다.")
                .build();
        commentRepository.save(c14);
        log.info("Saved cno14: {}", c14.getCno());

        Comment c15 = Comment.builder()
                .pno(5L).mno(3L)
                .content("연장 후 변경사항이 있으면 고객센터에 연락해 주세요.")
                .build();
        commentRepository.save(c15);
        log.info("Saved cno15: {}", c15.getCno());

        // pno 6 (3 comments)
        Comment c16 = Comment.builder()
                .pno(6L).mno(5L)
                .content("현장에서 바로 공기 주입해 드립니다.")
                .build();
        commentRepository.save(c16);
        log.info("Saved cno16: {}", c16.getCno());

        Comment c17 = Comment.builder()
                .pno(6L).mno(12L)
                .content("공기 주입기는 무료 대여 가능합니다.")
                .build();
        commentRepository.save(c17);
        log.info("Saved cno17: {}", c17.getCno());

        Comment c18 = Comment.builder()
                .pno(6L).mno(9L)
                .content("대여하실 때 미리 연락주시면 준비해 놓겠습니다.")
                .build();
        commentRepository.save(c18);
        log.info("Saved cno18: {}", c18.getCno());

        // pno 7 (2 comments)
        Comment c19 = Comment.builder()
                .pno(7L).mno(4L)
                .content("취소는 마이페이지에서 가능하며 전액 환불됩니다.")
                .build();
        commentRepository.save(c19);
        log.info("Saved cno19: {}", c19.getCno());

        Comment c20 = Comment.builder()
                .pno(7L).mno(14L)
                .content("환불은 결제 수단으로 자동 처리됩니다.")
                .build();
        commentRepository.save(c20);
        log.info("Saved cno20: {}", c20.getCno());

        // pno 8 (4 comments)
        Comment c21 = Comment.builder()
                .pno(8L).mno(10L)
                .content("무료 배송 외에도 전용 이벤트 초대 혜택이 있습니다.")
                .build();
        commentRepository.save(c21);
        log.info("Saved cno21: {}", c21.getCno());

        Comment c22 = Comment.builder()
                .pno(8L).mno(6L)
                .content("실시간 할인 쿠폰도 제공됩니다.")
                .build();
        commentRepository.save(c22);
        log.info("Saved cno22: {}", c22.getCno());

        Comment c23 = Comment.builder()
                .pno(8L).mno(1L)
                .content("골드 회원 전용 고객센터 전화번호가 별도 있습니다.")
                .build();
        commentRepository.save(c23);
        log.info("Saved cno23: {}", c23.getCno());

        Comment c24 = Comment.builder()
                .pno(8L).mno(11L)
                .content("포인트 적립률이 2배로 제공됩니다.")
                .build();
        commentRepository.save(c24);
        log.info("Saved cno24: {}", c24.getCno());

        // pno 9 (5 comments)
        Comment c25 = Comment.builder()
                .pno(9L).mno(7L)
                .content("강남역 5번 출구 근처 관악구 풋살장 추천합니다.")
                .build();
        commentRepository.save(c25);
        log.info("Saved cno25: {}", c25.getCno());

        Comment c26 = Comment.builder()
                .pno(9L).mno(2L)
                .content("가산 실내 구장도 시설이 좋습니다.")
                .build();
        commentRepository.save(c26);
        log.info("Saved cno26: {}", c26.getCno());

        Comment c27 = Comment.builder()
                .pno(9L).mno(8L)
                .content("야외 구장으로는 종로 풋살장을 추천드립니다.")
                .build();
        commentRepository.save(c27);
        log.info("Saved cno27: {}", c27.getCno());

        Comment c28 = Comment.builder()
                .pno(9L).mno(12L)
                .content("주차 공간은 판교 구장이 편리합니다.")
                .build();
        commentRepository.save(c28);
        log.info("Saved cno28: {}", c28.getCno());

        Comment c29 = Comment.builder()
                .pno(9L).mno(3L)
                .content("인조잔디 구장을 원하시면 강남 풋살장이 좋아요.")
                .build();
        commentRepository.save(c29);
        log.info("Saved cno29: {}", c29.getCno());

        // pno 10 (2 comments)
        Comment c30 = Comment.builder()
                .pno(10L).mno(5L)
                .content("파손 시 보상 기준은 약관 3조를 확인하세요.")
                .build();
        commentRepository.save(c30);
        log.info("Saved cno30: {}", c30.getCno());

        Comment c31 = Comment.builder()
                .pno(10L).mno(13L)
                .content("보험 옵션을 추가하시면 보상이 가능합니다.")
                .build();
        commentRepository.save(c31);
        log.info("Saved cno31: {}", c31.getCno());

        // pno 11 (3 comments)
        Comment c32 = Comment.builder()
                .pno(11L).mno(9L)
                .content("야외 구장은 추가 요금이 발생합니다.")
                .build();
        commentRepository.save(c32);
        log.info("Saved cno32: {}", c32.getCno());

        Comment c33 = Comment.builder()
                .pno(11L).mno(15L)
                .content("날씨에 따라 운영 시간 변동이 있습니다.")
                .build();
        commentRepository.save(c33);
        log.info("Saved cno33: {}", c33.getCno());

        Comment c34 = Comment.builder()
                .pno(11L).mno(4L)
                .content("야외 대관은 최소 2시간부터 가능합니다.")
                .build();
        commentRepository.save(c34);
        log.info("Saved cno34: {}", c34.getCno());

        // pno 12 (1 comment)
        Comment c35 = Comment.builder()
                .pno(12L).mno(6L)
                .content("장비 상태에 만족하셨다니 다행입니다!")
                .build();
        commentRepository.save(c35);
        log.info("Saved cno35: {}", c35.getCno());

        // pno 13 (4 comments)
        Comment c36 = Comment.builder()
                .pno(13L).mno(2L)
                .content("다리 스트레칭은 런지 자세로 시작하세요.")
                .build();
        commentRepository.save(c36);
        log.info("Saved cno36: {}", c36.getCno());

        Comment c37 = Comment.builder()
                .pno(13L).mno(11L)
                .content("햄스트링 풀어주는 동작도 좋습니다.")
                .build();
        commentRepository.save(c37);
        log.info("Saved cno37: {}", c37.getCno());

        Comment c38 = Comment.builder()
                .pno(13L).mno(14L)
                .content("발목 회전 운동을 추가해 보세요.")
                .build();
        commentRepository.save(c38);
        log.info("Saved cno38: {}", c38.getCno());

        Comment c39 = Comment.builder()
                .pno(13L).mno(1L)
                .content("10분 정도 가볍게 진행하시길 권장합니다.")
                .build();
        commentRepository.save(c39);
        log.info("Saved cno39: {}", c39.getCno());

        // pno 14 (2 comments)
        Comment c40 = Comment.builder()
                .pno(14L).mno(3L)
                .content("서버 오류 발생 시 잠시 후 재시도해 보세요.")
                .build();
        commentRepository.save(c40);
        log.info("Saved cno40: {}", c40.getCno());

        Comment c41 = Comment.builder()
                .pno(14L).mno(8L)
                .content("문제가 지속되면 고객센터로 문의 바랍니다.")
                .build();
        commentRepository.save(c41);
        log.info("Saved cno41: {}", c41.getCno());

        // pno 15 (3 comments)
        Comment c42 = Comment.builder()
                .pno(15L).mno(5L)
                .content("쿠폰은 장바구니 단계에서 적용됩니다.")
                .build();
        commentRepository.save(c42);
        log.info("Saved cno42: {}", c42.getCno());

        Comment c43 = Comment.builder()
                .pno(15L).mno(12L)
                .content("유효기간을 확인해 보세요.")
                .build();
        commentRepository.save(c43);
        log.info("Saved cno43: {}", c43.getCno());

        Comment c44 = Comment.builder()
                .pno(15L).mno(7L)
                .content("할인 코드 입력 후 새로고침 해보세요.")
                .build();
        commentRepository.save(c44);
        log.info("Saved cno44: {}", c44.getCno());

        // pno 16 (5 comments)
        Comment c45 = Comment.builder()
                .pno(16L).mno(4L)
                .content("스파이크 없는 주니어 전용 풋살화 추천드립니다.")
                .build();
        commentRepository.save(c45);
        log.info("Saved cno45: {}", c45.getCno());

        Comment c46 = Comment.builder()
                .pno(16L).mno(13L)
                .content("편안한 착화감을 위해 한 사이즈 크게 주문하세요.")
                .build();
        commentRepository.save(c46);
        log.info("Saved cno46: {}", c46.getCno());

        Comment c47 = Comment.builder()
                .pno(16L).mno(1L)
                .content("가죽 소재보다 합성 소재가 더 가볍습니다.")
                .build();
        commentRepository.save(c47);
        log.info("Saved cno47: {}", c47.getCno());

        Comment c48 = Comment.builder()
                .pno(16L).mno(15L)
                .content("아웃솔 그립감이 좋은 모델이 인기입니다.")
                .build();
        commentRepository.save(c48);
        log.info("Saved cno48: {}", c48.getCno());

        Comment c49 = Comment.builder()
                .pno(16L).mno(6L)
                .content("통풍이 잘 되는 디자인을 선택하세요.")
                .build();
        commentRepository.save(c49);
        log.info("Saved cno49: {}", c49.getCno());

        // pno 17 (1 comment)
        Comment c50 = Comment.builder()
                .pno(17L).mno(9L)
                .content("최소 대여 기간은 1일이며, 시간 단위 연장은 불가능합니다.")
                .build();
        commentRepository.save(c50);
        log.info("Saved cno50: {}", c50.getCno());

        // pno 18 (4 comments)
        Comment c51 = Comment.builder()
                .pno(18L).mno(10L)
                .content("관악구 구장 바닥이 정말 좋죠!")
                .build();
        commentRepository.save(c51);
        log.info("Saved cno51: {}", c51.getCno());

        Comment c52 = Comment.builder()
                .pno(18L).mno(2L)
                .content("조명도 밝아서 야간 이용하기 좋습니다.")
                .build();
        commentRepository.save(c52);
        log.info("Saved cno52: {}", c52.getCno());

        Comment c53 = Comment.builder()
                .pno(18L).mno(14L)
                .content("예약 시스템도 편리합니다.")
                .build();
        commentRepository.save(c53);
        log.info("Saved cno53: {}", c53.getCno());

        Comment c54 = Comment.builder()
                .pno(18L).mno(5L)
                .content("시설 관리가 잘 되어 있습니다.")
                .build();
        commentRepository.save(c54);
        log.info("Saved cno54: {}", c54.getCno());

        // pno 19 (2 comments)
        Comment c55 = Comment.builder()
                .pno(19L).mno(7L)
                .content("사용 전후로 공기압을 측정해 보세요.")
                .build();
        commentRepository.save(c55);
        log.info("Saved cno55: {}", c55.getCno());

        Comment c56 = Comment.builder()
                .pno(19L).mno(11L)
                .content("적정 공기압은 0.8~1.0bar 입니다.")
                .build();
        commentRepository.save(c56);
        log.info("Saved cno56: {}", c56.getCno());

        // pno 20 (3 comments)
        Comment c57 = Comment.builder()
                .pno(20L).mno(3L)
                .content("친절한 CS에 저도 만족했습니다.")
                .build();
        commentRepository.save(c57);
        log.info("Saved cno57: {}", c57.getCno());

        Comment c58 = Comment.builder()
                .pno(20L).mno(12L)
                .content("예약 과정이 직관적이어서 편리했어요.")
                .build();
        commentRepository.save(c58);
        log.info("Saved cno58: {}", c58.getCno());

        Comment c59 = Comment.builder()
                .pno(20L).mno(8L)
                .content("다음에도 이용할 예정입니다.")
                .build();
        commentRepository.save(c59);
        log.info("Saved cno59: {}", c59.getCno());
    }
}
