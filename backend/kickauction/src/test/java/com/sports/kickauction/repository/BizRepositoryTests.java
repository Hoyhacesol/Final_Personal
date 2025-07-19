package com.sports.kickauction.repository;

import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Biz;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.entity.Seller;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class BizRepositoryTests {

    @Autowired
    private BizRepository bizRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Test
    @Transactional
    @Rollback(false)
    public void insertRandomBidsForAllSellers() {
        List<Request> requests = requestRepository.findAll()
        .stream()
        .filter(r -> r.getFinished() == 0)
        .toList();
        List<Seller> sellers = sellerRepository.findAll();

        if (requests.isEmpty() || sellers.isEmpty()) {
            log.warn("요청 또는 판매자가 없습니다.");
            return;
        }

        List<String> contents = List.of(
            "정품 장비 풀세트 구성, 유니폼 포함",
            "풋살공, 보호대, 팀 조끼 포함",
            "인근 경기장과 연계된 렌탈 가능",
            "여성 팀용 사이즈 보유",
            "리그용 공인 장비 제공"
        );

        List<String> answers = List.of(
            "요청하신 장소와 시간 모두 가능하며, 장비는 경기 30분 전 도착 예정입니다.",
            "배송 및 설치 포함이며, 경기 후 회수까지 처리됩니다.",
            "야외 경기에도 적합한 장비로 준비 가능합니다.",
            "지정하신 일정 문제없이 대응 가능합니다.",
            "추가 요청 있으시면 유연하게 반영 가능합니다."
        );

        Random rand = ThreadLocalRandom.current();

        for (Seller seller : sellers) {
            Request request = requests.get(rand.nextInt(requests.size()));

            Biz existingBid = bizRepository.findAll()
          .stream()
          .filter(b -> b.getSeller().equals(seller) && b.getRequest().equals(request))
          .findFirst()
          .orElse(null);

  if (existingBid != null) continue; // 이미 입찰함

            Biz biz = Biz.builder()
                    .seller(seller)
                    .request(request)
                    .price(rand.nextLong(30000, 100000))
                    .bcontent(contents.get(rand.nextInt(contents.size())))
                    .banswer(answers.get(rand.nextInt(answers.size())))
                    .deleted(false)
                    .build();

            bizRepository.save(biz);
        }

        log.info("전체 Seller → 무작위 Request에 입찰 완료");
    }
}
