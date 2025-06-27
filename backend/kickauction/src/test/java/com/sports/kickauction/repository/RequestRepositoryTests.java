// com.sports.kickauction.repository.RequestRepositoryTests
package com.sports.kickauction.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.entity.Request;

import lombok.extern.log4j.Log4j2; // ThreadLocalRandom 추가 (더 좋은 랜덤 생성기)


@Log4j2
@SpringBootTest
public class RequestRepositoryTests {

    @Autowired
    private RequestRepository requestRepository;

    // Random 객체를 ThreadLocalRandom으로 변경 (멀티스레드 환경에서 더 안전)
    private final Random random = ThreadLocalRandom.current();

    private final List<String> locations = List.of("서울특별시 강남구", "서울특별시 관악구", "서울특별시 마포구", "서울특별시 송파구", "서울특별시 중구",
        "제주특별자치도", "세종특별자치시", "대전광역시", "광주광역시", "대구광역시", "울산광역시", "경기도", "강원도", "충청북도","부산광역시", "인천광역시");
    private final List<String> contents = List.of(
        "경기 전 워밍업까지 필요합니다.",
        "골키퍼 장비도 대여 가능한가요?",
        "단체로 이용할 예정입니다.",
        "실내 풋살장 선호합니다.",
        "강남 근처 우선적으로 요청합니다.",
        "시간 엄수 중요합니다.",
        "장비 상태 양호한 것 위주로 부탁드려요.",
        "팀 유니폼도 필요해요.",
        "운동화 포함인가요?",
        "날씨가 안 좋아도 가능한 시설이면 좋겠어요."
    );

    // ⭐️ 랜덤 타이틀 생성을 위한 추가 리스트 ⭐️
    private final List<String> titlePrefixes = List.of("급구!", "긴급!", "매치 구해요", "풋살 모집", "축구팀 찾습니다");
    private final List<String> titleSuffixes = List.of("아침부터", "주말", "평일 저녁", "내일 오전", "아무때나");

    @Test
    public void test1() {
        log.info("--------------------------");
        log.info(requestRepository);
    }
    
    @Test
    @Transactional
    @Rollback(false)
    public void generateDummyRequests() {
        // finished = 0: 진행 중, 1: 마감, 2: 취소
        for (int finished = 0; finished <= 2; finished++) {
            for (int i = 0; i < 5; i++) {
                String playType = random.nextBoolean() ? "축구" : "풋살";
                String rentalEquipment = playType.equals("축구") ? "축구장비" : "풋살장비";

                Request request = Request.builder()
                        .mno(1)
                        .playType(playType)
                        .olocation(randomLocation())
                        .rentalDate(randomFutureDate())
                        .rentalTime(randomHour())
                        .person(random.nextInt(30) + 1) // 1~30
                        .rentalEquipment(rentalEquipment)
                        .ocontent(randomContent())
                        .oregdate(LocalDateTime.now())
                        .finished(finished)
                        .otitle(generateRandomTitle(playType, randomLocation())) // 랜덤 제목 생성
                        .build();

                requestRepository.save(request);
            }
        }
        log.info("더미 요청 30개 (각 finished 상태별 10개) 생성 완료.");
    }

    @Test
    @Transactional
    @Rollback(false)
    public void deleteAllRequests() {
        requestRepository.deleteAll();
    }

    private String randomLocation() {
        return locations.get(random.nextInt(locations.size()));
    }

    private String randomContent() {
        return contents.get(random.nextInt(contents.size()));
    }

    private LocalDateTime randomFutureDate() {
        int days = random.nextInt(30); // 오늘부터 30일 이내
        int hours = random.nextInt(24);
        int minutes = random.nextInt(60);
        return LocalDateTime.now().plusDays(days).plusHours(hours).plusMinutes(minutes); // 분 추가
    }

    private String randomHour() {
        int hour = random.nextInt(16) + 7; // 7~22시
        return String.format("%02d:00", hour); // 07:00, 08:00 형태로 포맷팅
    }

    //  랜덤 타이틀 생성 메서드 
    private String generateRandomTitle(String playType, String location) {
        String prefix = titlePrefixes.get(random.nextInt(titlePrefixes.size()));
        String suffix = titleSuffixes.get(random.nextInt(titleSuffixes.size()));
        
        // 종목과 지역 정보를 포함한 제목 생성
        return String.format("%s %s %s %s", prefix, playType, location.split(" ")[0], suffix);
    }
}