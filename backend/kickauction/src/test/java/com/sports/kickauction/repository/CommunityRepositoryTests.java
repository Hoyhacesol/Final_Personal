package com.sports.kickauction.repository;

import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.service.CommunityService;
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
public class CommunityRepositoryTests {

    @Autowired
    private CommunityService communityService;

    @Test
    public void insert20CommunityPosts() {
        CommunityDTO dto1 = CommunityDTO.builder()
                .mno(1L)
                .ptitle("주말 풋살장 예약 가능한 시간대 문의합니다")
                .pcontent("안녕하세요, 이번 주말에 3시간 정도 풋살장 대여하려고 합니다. 오후 2시~5시 사이에 예약 가능한 구장 있나요?")
                .view(15)
                .pimage(null)
                .build();
        log.info("Saved pno1: {}", communityService.register(dto1, null).getPno());

        CommunityDTO dto2 = CommunityDTO.builder()
                .mno(2L)
                .ptitle("어린이용 축구공 추천 부탁드려요")
                .pcontent("초등학생 10세 아이가 사용할 축구공을 찾고 있는데, 내구성 좋고 가성비 좋은 제품 있을까요?")
                .view(28)
                .pimage(null)
                .build();
        log.info("Saved pno2: {}", communityService.register(dto2, null).getPno());

        CommunityDTO dto3 = CommunityDTO.builder()
                .mno(3L)
                .ptitle("축구화 사이즈가 안 맞아서 교환 가능한가요?")
                .pcontent("주문한 축구화가 한 사이즈 작게 왔습니다. 교환 절차와 배송비 부담 여부 알려주세요.")
                .view(42)
                .pimage(null)
                .build();
        log.info("Saved pno3: {}", communityService.register(dto3, null).getPno());

        CommunityDTO dto4 = CommunityDTO.builder()
                .mno(4L)
                .ptitle("역경매 방식은 어떻게 진행되나요?")
                .pcontent("처음 이용하는데, 역경매에 입찰하려면 어떤 절차를 거쳐야 하나요? 입찰 취소는 가능한가요?")
                .view(33)
                .pimage(null)
                .build();
        log.info("Saved pno4: {}", communityService.register(dto4, null).getPno());

        CommunityDTO dto5 = CommunityDTO.builder()
                .mno(5L)
                .ptitle("대여 중인 축구공 연장 가능할까요?")
                .pcontent("현재 축구공을 빌린 상태인데, 하루 더 연장하고 싶습니다. 추가 요금과 절차 알려주세요.")
                .view(19)
                .pimage(null)
                .build();
        log.info("Saved pno5: {}", communityService.register(dto5, null).getPno());

        CommunityDTO dto6 = CommunityDTO.builder()
                .mno(1L)
                .ptitle("대여한 축구공이 바람이 빠졌어요")
                .pcontent("렌트한 공을 받았는데 공기압이 너무 낮아 사용이 어려워요. 교환 혹은 보충 가능한가요?")
                .view(27)
                .pimage(null)
                .build();
        log.info("Saved pno6: {}", communityService.register(dto6, null).getPno());

        CommunityDTO dto7 = CommunityDTO.builder()
                .mno(2L)
                .ptitle("예약 취소 시 환불은 어떻게 되나요?")
                .pcontent("어제 예약했는데 개인 사정으로 취소하려고 합니다. 환불 규정 확인 부탁드립니다.")
                .view(31)
                .pimage(null)
                .build();
        log.info("Saved pno7: {}", communityService.register(dto7, null).getPno());

        CommunityDTO dto8 = CommunityDTO.builder()
                .mno(3L)
                .ptitle("골드 등급 회원 혜택이 궁금합니다")
                .pcontent("등급이 골드로 업그레이드됐는데, 대여료 할인 외에 어떤 혜택이 있나요?")
                .view(22)
                .pimage(null)
                .build();
        log.info("Saved pno8: {}", communityService.register(dto8, null).getPno());

        CommunityDTO dto9 = CommunityDTO.builder()
                .mno(4L)
                .ptitle("서울 강남구 내 추천 풋살장 있나요?")
                .pcontent("주말에 친구랑 가기 좋은 실내 풋살장, 강남역 근처 추천 부탁드립니다.")
                .view(45)
                .pimage(null)
                .build();
        log.info("Saved pno9: {}", communityService.register(dto9, null).getPno());

        CommunityDTO dto10 = CommunityDTO.builder()
                .mno(5L)
                .ptitle("렌트 중 장비 파손되면 어떻게 하나요?")
                .pcontent("사용 도중 장비가 파손되면 보상은 어떻게 진행되는지 알고 싶습니다.")
                .view(29)
                .pimage(null)
                .build();
        log.info("Saved pno10: {}", communityService.register(dto10, null).getPno());

        CommunityDTO dto11 = CommunityDTO.builder()
                .mno(1L)
                .ptitle("야외 풋살장 대관도 가능한가요?")
                .pcontent("실내뿐 아니라 야외 구장도 대여 가능한지 확인하고 싶습니다.")
                .view(18)
                .pimage(null)
                .build();
        log.info("Saved pno11: {}", communityService.register(dto11, null).getPno());

        CommunityDTO dto12 = CommunityDTO.builder()
                .mno(2L)
                .ptitle("대여 장비 상태 너무 만족스러워요!")
                .pcontent("축구화도 새 것 같고 공 상태도 좋아서 경기가 잘 진행됐습니다.")
                .view(52)
                .pimage(null)
                .build();
        log.info("Saved pno12: {}", communityService.register(dto12, null).getPno());

        CommunityDTO dto13 = CommunityDTO.builder()
                .mno(8L)
                .ptitle("경기 전 추천 스트레칭 루틴 공유합니다")
                .pcontent("다리 근육 부상 방지에 좋은 스트레칭 동작 5가지를 소개합니다.")
                .view(40)
                .pimage(null)
                .build();
        log.info("Saved pno13: {}", communityService.register(dto13, null).getPno());

        CommunityDTO dto14 = CommunityDTO.builder()
                .mno(7L)
                .ptitle("결제 진행 중 ‘서버 오류’가 발생합니다")
                .pcontent("카드 결제 시 결제 완료가 되지 않고 오류가 뜹니다. 해결 방법 있을까요?")
                .view(36)
                .pimage(null)
                .build();
        log.info("Saved pno14: {}", communityService.register(dto14, null).getPno());

        CommunityDTO dto15 = CommunityDTO.builder()
                .mno(6L)
                .ptitle("10% 할인 쿠폰 적용이 안 돼요")
                .pcontent("쿠폰 코드 입력 후 결제 페이지에서 할인이 반영되지 않습니다.")
                .view(25)
                .pimage(null)
                .build();
        log.info("Saved pno15: {}", communityService.register(dto15, null).getPno());

        CommunityDTO dto16 = CommunityDTO.builder()
                .mno(10L)
                .ptitle("어린이용 풋살화 추천 부탁드려요")
                .pcontent("발 사이즈 16cm, 편안하고 가벼운 풋살화 찾고 있습니다.")
                .view(33)
                .pimage(null)
                .build();
        log.info("Saved pno16: {}", communityService.register(dto16, null).getPno());

        CommunityDTO dto17 = CommunityDTO.builder()
                .mno(8L)
                .ptitle("장비 최소 대여 기간이 어떻게 되나요?")
                .pcontent("축구 골대를 하루만 빌리고 싶은데, 가능 여부 알고 싶습니다.")
                .view(27)
                .pimage(null)
                .build();
        log.info("Saved pno17: {}", communityService.register(dto17, null).getPno());

        CommunityDTO dto18 = CommunityDTO.builder()
                .mno(6L)
                .ptitle("제가 가장 좋아하는 풋살장은 OO 구장입니다")
                .pcontent("가격도 저렴하고 바닥 상태가 좋아서 추천합니다.")
                .view(44)
                .pimage(null)
                .build();
        log.info("Saved pno18: {}", communityService.register(dto18, null).getPno());

        CommunityDTO dto19 = CommunityDTO.builder()
                .mno(9L)
                .ptitle("공 대여 후에는 반드시 공기압 확인하세요")
                .pcontent("공이 너무 빵빵하면 터질 수 있으니 적정압 유지 바랍니다.")
                .view(30)
                .pimage(null)
                .build();
        log.info("Saved pno19: {}", communityService.register(dto19, null).getPno());

        CommunityDTO dto20 = CommunityDTO.builder()
                .mno(7L)
                .ptitle("정말 편리한 대여 서비스 감사합니다!")
                .pcontent("간편한 예약, 빠른 배달, 친절한 CS 덕분에 만족스럽게 이용했습니다.")
                .view(60)
                .pimage(null)
                .build();
        log.info("Saved pno20: {}", communityService.register(dto20, null).getPno());
    }
}