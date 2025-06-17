package com.sports.kickauction.repository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;

import jakarta.transaction.Transactional;

@SpringBootTest
public class MemberRepositoyTests {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerIntroRepository sellerIntroRepository;



@Test
@Transactional
@Rollback(false)
public void insertDummySellersWithIntro() {
    for (int i = 2; i <= 100; i++) {
        // 1. Member 생성
        Member member = Member.builder()
                .userId("testuser" + i)
                .userPw("1234")
                .userName("테스트회원" + i)
                .phone("0109999" + String.format("%04d", i))
                .role("USER")
                .social(0)
                .social(0)
                .build();
        memberRepository.save(member);

        // 2. Seller 생성
        Seller seller = Seller.builder()
                .member(member)
                .sname("테스트업체" + i)
                .slocation("서울시 테스트로 " + i + "길")
                .build();
        sellerRepository.save(seller);

        // 3. SellerIntro 생성 (이미지는 더미 문자열로 처리)
        SellerIntro intro = SellerIntro.builder()
                .seller(seller)
                .simage("dummy1.jpg,dummy2.jpg,dummy3.jpg") // 실제 이미지는 없지만 리스트 구조 맞춤
                .info("테스트 업체 정보입니다 - info " + i)
                .introContent("테스트 업체 소개글입니다 - intro " + i)
                .hiredCount(i * 2)
                .build();
        sellerIntroRepository.save(intro);
    }
}

@Test
@Transactional
@Rollback(false)
public void deleteTestUsersExcept01() {
    // 1. SellerIntro 삭제 (testuser01 제외)
    sellerIntroRepository.findAll().stream()
            .filter(intro -> {
                String userId = intro.getSeller().getMember().getUserId();
                return userId.startsWith("testuser") && !userId.equals("testuser01");
            })
            .forEach(sellerIntroRepository::delete);

    // 2. Seller 삭제 (testuser01 제외)
    sellerRepository.findAll().stream()
            .filter(seller -> {
                String userId = seller.getMember().getUserId();
                return userId.startsWith("testuser") && !userId.equals("testuser01");
            })
            .forEach(sellerRepository::delete);

    // 3. Member 삭제 (testuser01 제외)
    memberRepository.findAll().stream()
            .filter(member -> member.getUserId().startsWith("testuser") && !member.getUserId().equals("testuser01"))
            .forEach(memberRepository::delete);
}
}

