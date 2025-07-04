package com.sports.kickauction.repository;

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
    for (int i = 1; i <= 150; i++) {
        // 1. Member 생성
        Member member = Member.builder()
                .userId("testuser" + i)
                .userPw("1234")
                .userName("테스트회원" + i)
                .phone("0109999" + String.format("%04d", i))
                .role("SELLER")
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
public void deleteTestUsers() {
    // 1. SellerIntro 삭제 
    sellerIntroRepository.findAll().stream()
            .filter(intro -> {
                String userId = intro.getSeller().getMember().getUserId();
                return userId.startsWith("testuser");
            })
            .forEach(sellerIntroRepository::delete);

    // 2. Seller 삭제 
    sellerRepository.findAll().stream()
            .filter(seller -> {
                String userId = seller.getMember().getUserId();
                return userId.startsWith("testuser");
            })
            .forEach(sellerRepository::delete);

    // 3. Member 삭제 
    memberRepository.findAll().stream()
            .filter(member -> member.getUserId().startsWith("testuser"))
            .forEach(memberRepository::delete);
}

@Test
@Transactional
@Rollback(false)
public void insertLongTextSeller() {
    // 1. Member 생성
    Member member = Member.builder()
            .userId("testlonguser")
            .userPw("1234")
            .userName("긴텍스트회원")
            .phone("01012345678")
            .role("Seller")
            .social(0)
            .build();
    memberRepository.save(member);

    // 2. Seller 생성
    Seller seller = Seller.builder()
            .member(member)
            .sname("이것은 매우 긴 업체명입니다. 이 업체명은 정말로 길어서 카드 레이아웃이 깨지는지 확인해보려는 목적으로 작성되었습니다.")
            .slocation("대한민국 서울특별시 강남구 삼성로 123길 456-78 아주 복잡한 주소를 표현하기 위한 테스트 데이터입니다.")
            .build();
    sellerRepository.save(seller);

    // 3. SellerIntro 생성
    SellerIntro intro = SellerIntro.builder()
            .seller(seller)
            .simage("longdummy1.jpg,longdummy2.jpg")
            .info("긴 업체 정보 내용입니다. 여러 줄에 걸쳐서 매우 많은 텍스트를 포함하고 있고, 줄바꿈 없이 길게 이어질 수도 있습니다.")
            .introContent("이 업체는 다양한 서비스를 제공합니다. 이 문장은 소개글이 아주 길어졌을 때 어떤 식으로 표현되는지를 테스트하기 위한 것입니다.")
            .hiredCount(999)
            .build();
    sellerIntroRepository.save(intro);
}

@Test
@Transactional
@Rollback(false)
public void insertDemoSellerForImageUpload() {
    // 1. 이미지 업로드 테스트용 Member 생성
    Member member = Member.builder()
            .userId("imageDemoUser")
            .userPw("1234")
            .userName("이미지데모업체")
            .phone("01000000000")
            .role("Seller") // 문자열 "Seller"
            .social(0)
            .build();
    memberRepository.save(member);

    // 2. 해당 Member에 연결된 Seller 생성
    Seller seller = Seller.builder()
            .member(member)
            .sname("이미지 업로드 테스트 업체")
            .slocation("서울시 강남구 업로드로 123")
            .build();
    sellerRepository.save(seller);

    // SellerIntro는 생략 — 프론트에서 props로 수동 넘겨서 사용할 예정
}

 @Test
    @Transactional
    @Rollback(false)
    public void insertUniqueTestSellers() {

        for (int i = 1004; i <= 1004; i++) {
            String uid = "unique_testuser_" + i;

            Member member = Member.builder()
                    .userId(uid)
                    .userPw("pw" + i)
                    .userName("테스트계정" + i)
                    .phone("0108888" + i)
                    .role("Seller")
                    .social(0)
                    .build();
            memberRepository.save(member);

            Seller seller = Seller.builder()
                    .member(member)
                    .sname("테스트업체 " + i)
                    .slocation("서울시 마포구 테스트로 " + i + "길")
                    .build();
            sellerRepository.save(seller);

    }
}
}


