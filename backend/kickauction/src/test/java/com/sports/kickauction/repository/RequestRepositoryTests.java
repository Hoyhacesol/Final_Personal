package com.sports.kickauction.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.log4j.Log4j2;

import com.sports.kickauction.entity.Request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;


@Log4j2
@SpringBootTest
public class RequestRepositoryTests {

    @Autowired
    private RequestRepository requestRepository;

    private final Random random = new Random();

    private final List<String> locations = List.of("서울특별시 강남구", "서울특별시 관악구", "서울특별시 마포구", "서울특별시 송파구", "서울특별시 중구");
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
    
    @Test
    public void test1() {
        log.info("--------------------------");
        log.info(requestRepository);
    }
    @Test
    @Transactional
    @Rollback(false)
    public void generateDummyRequests() {
        for (int finished = 0; finished <= 2; finished++) {
            for (int i = 0; i < 5; i++) {
                String playType = random.nextBoolean() ? "축구" : "풋살";
                String rentalEquipment = playType.equals("축구") ? "축구장비" : "풋살장비";

                Request request = Request.builder()
                        .mno(2)
                        .playType(playType)
                        .olocation(randomLocation())
                        .rentalDate(randomFutureDate())
                        .rentalTime(randomHour())
                        .person(random.nextInt(30) + 1) // 1~30
                        .rentalEquipment(rentalEquipment)
                        .ocontent(randomContent())
                        .regdate(LocalDateTime.now())
                        .finished(finished)
                        .build();

                requestRepository.save(request);
            }
        }
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
        return LocalDateTime.now().plusDays(days).plusHours(hours);
    }

    private String randomHour() {
        int hour = random.nextInt(16) + 7; // 7~22
        return hour + ":00";
    }
}
