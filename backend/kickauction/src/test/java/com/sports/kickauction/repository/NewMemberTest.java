package com.sports.kickauction.repository;

import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;

import jakarta.transaction.Transactional;

@SpringBootTest
public class NewMemberTest {
  
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private SellerIntroRepository sellerIntroRepository;


    @Test
    @Transactional
    @Rollback(false)
    public void insertExactMembers() {
        List<Member> members = List.of(
            Member.builder()
                .phone("010-2923-1010")
                .profileimg("p10.gif")
                .role("USER")
                .social(1)
                .userId("kim@naver.com")
                .userName("찰떡아이스")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-3333-1010")
                .profileimg("p01.jpg")
                .role("USER")
                .social(1)
                .userId("yoyo@naver.com")
                .userName("키드밀리")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-6666-1111")
                .profileimg("baseprofile.png")
                .role("USER")
                .social(0)
                .userId("android@gmail.com")
                .userName("레드와인")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-6666-2222")
                .profileimg("p09.jpg")
                .role("USER")
                .social(1)
                .userId("bird@naver.com")
                .userName("순대곱창킬러")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-3336-2222")
                .profileimg("p02.jpg")
                .role("USER")
                .social(1)
                .userId("kinggnu@naver.com")
                .userName("박병호")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-9999-1320")
                .profileimg("p07.png")
                .role("USER")
                .social(0)
                .userId("sandy@naver.com")
                .userName("주니어네키")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1239-1320")
                .profileimg("baseprofile.png")
                .role("USER")
                .social(1)
                .userId("orion@naver.com")
                .userName("헤라클레스")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1213-1326")
                .profileimg("p06.gif")
                .role("USER")
                .social(0)
                .userId("play@naver.com")
                .userName("오즈와마법사")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1111-3123")
                .profileimg("p05.png")
                .role("USER")
                .social(0)
                .userId("cracker@naver.com")
                .userName("ZUTOMAYO")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1311-3523")
                .profileimg("p08.png")
                .role("SELLER")
                .social(0)
                .userId("seller@naver.com")
                .userName("버번")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1351-3573")
                .profileimg("p04.png")
                .role("SELLER")
                .social(0)
                .userId("squad@naver.com")
                .userName("히스이")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-6351-3573")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("style@naver.com")
                .userName("오금동벤제마")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-5551-3573")
                .profileimg("p03.png")
                .role("SELLER")
                .social(0)
                .userId("killer@naver.com")
                .userName("래버리지20배율")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-3213-5513")
                .profileimg("p11.gif")
                .role("SELLER")
                .social(0)
                .userId("bape@naver.com")
                .userName("홍지원")
                .userPw(encoded("qwer1"))
                .build(),
                Member.builder()
                .phone("010-1312-3523")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("kickcenter@naver.com")
                .userName("윤정호")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-2522-1145")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("kplus@naver.com")
                .userName("장대현")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-7988-2211")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("spoone@naver.com")
                .userName("홍석진")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-4567-8971")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("footzone@naver.com")
                .userName("신지훈")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-7894-1236")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("innokick@naver.com")
                .userName("조성은")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-3234-4561")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("acekick@naver.com")
                .userName("김서준")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-1212-2323")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("kfootkorea@naver.com")
                .userName("박찬혁")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-9999-8888")
                .profileimg("baseprofile.png")
                .role("SELLER")
                .social(0)
                .userId("defaultbiz@naver.com")
                .userName("정우성")
                .userPw(encoded("qwer1"))
                .build(),
            Member.builder()
                .phone("010-3661-5513")
                .profileimg("p12.jpg")
                .role("ADMIN")
                .social(0)
                .userId("brintelix@naver.com")
                .userName("플레어송")
                .userPw(encoded("qwer1"))
                .build()
        );

        members.forEach(memberRepository::save);

        String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        List<String> imagesToCopy = List.of(
"ss1.webp", "s1.jpg", "s2.jpg",
            "ss2.webp", "s3.jpg", "s4.jpg",
            "ss3.webp", "s5.jpg", "s6.jpg",
            "ss4.webp", "s7.jpg", "s8.jpg",
            "ss5.webp", "s9.jpg", "s10.jpg",
            "ss6.webp","s11.jpg", "s12.jpg", 
            "ss7.webp","s13.jpg", "s14.jpg",
            "ss8.webp","s15.jpg", "s16.jpg", 
            "ss9.webp","s17.jpg", "s18.jpg",
            "ss10.webp","s19.jpg","s20.jpg", 
            "ss11.webp","s21.jpg","s22.jpg",
            "ss12.webp"

        );
        imagesToCopy.forEach(img -> copyImage(img, folderPath));

        Seller s1 = sellerRepository.save(Seller.builder()
        .member(members.get(9))
        .sname("킥앤렌탈")
        .slocation("서울특별시 강남구 논현로 748")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s1)
        .introContent("대회 운영 경험이 풍부한 운영진이 직접 큐레이션한 장비 세트로 구성되어 있습니다. 행사나 친선 경기 전날까지 배송 보장.")
        .simage(folderPath + "/ss1.webp," + folderPath + "/s1.jpg," + folderPath + "/s2.jpg") // 대표 + 소개 2개
        .hiredCount(0)
        .info("전국 아마추어 리그 및 친선 경기 전용 장비 세트를 제공하는 전문 렌탈 업체입니다. 포지션별 조끼 색상 분리, 공인 풋살공 및 보호장비 풀세트 구비.")
        .build());

        Seller s2 = sellerRepository.save(Seller.builder()
        .member(members.get(10))
        .sname("JS스포츠렌탈")
        .slocation("서울특별시 성동구 왕십리로 222")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s2)
        .introContent("풋살/축구 경기에서 필요한 전용 공, 훈련 조끼, 골키퍼 장갑까지 풀세트로 구성됩니다. 단체 경기나 토너먼트에 적합한 고품질 제품.")
        .simage(folderPath + "/ss2.webp," + folderPath + "/s3.jpg," + folderPath + "/s4.jpg")
        .hiredCount(0)
        .info("JS 공식 파트너로 등록된 업체로, 브랜드 정품 장비만 취급합니다. 팀 단위 예약 시 추가 할인 및 유니폼 대여 옵션 제공.")
        .build());

        Seller s3 = sellerRepository.save(Seller.builder()
        .member(members.get(11))
        .sname("풋볼존렌탈")
        .slocation("서울특별시 마포구 월드컵북로 400")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s3)
        .introContent("경기력 향상에 최적화된 전용 풋살공과 팀 유니폼, 신가드 등 포함. 팀별 구성에 따라 탄력적으로 패키지 변경 가능.")
        .simage(folderPath + "/ss3.webp," + folderPath + "/s5.jpg," + folderPath + "/s6.jpg")
        .hiredCount(0)
        .info("풋볼존 브랜드와 동일한 장비로 구성된 프리미엄 패키지를 제공합니다. 정기 대여 고객에게는 장비 세척 및 유지 서비스 제공.")
        .build());

        Seller s4 = sellerRepository.save(Seller.builder()
        .member(members.get(12))
        .sname("대신렌탈스포츠")
        .slocation("서울특별시 구로구 디지털로 32길 78")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s4)
        .introContent("10인 이상 단체 예약 시, 코치용 장비 및 판넬 세트도 함께 제공됩니다. 안전검사 통과된 보호장비 포함.")
        .simage(folderPath + "/ss4.webp," + folderPath + "/s7.jpg," + folderPath + "/s8.jpg")
        .hiredCount(0)
        .info("기업 단체 및 학원 리그 대상 맞춤형 대여 서비스를 제공합니다. 출장 장비 설치와 수거까지 포함된 원스톱 시스템.")
        .build());

        Seller s5 = sellerRepository.save(Seller.builder()
        .member(members.get(13))
        .sname("KFC렌탈")
        .slocation("서울특별시 중구 명동길 74")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s5)
        .introContent("챔피언십 경기 대비용 패키지로, 고급 킥복, 공인 축구공, GPS 트래커 장비까지 포함된 구성입니다.")
        .simage(folderPath + "/ss5.webp," + folderPath + "/s9.jpg," + folderPath + "/s10.jpg")
        .hiredCount(0)
        .info("K-리그 선수단에 공급되는 동일 장비 기반의 프리미엄 대여 서비스. 경기 중급자 이상 추천 구성.")
        .build());

        Seller s6 = sellerRepository.save(Seller.builder()
        .member(members.get(14))
        .sname("스포존렌탈")
        .slocation("서울특별시 송파구 중대로 135")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s6)
        .introContent("경기 30분 전까지 현장 도착 및 설치 완료. 시간에 민감한 대회나 이벤트에 최적화된 서비스 제공.")
        .simage(folderPath + "/ss6.webp," + folderPath + "/s11.jpg," + folderPath + "/s12.jpg")
        .hiredCount(0)
        .info("지역 내 체육시설과 연계된 즉시 설치형 대여 서비스. 구장과의 연동 서비스 제공으로 설치/철수 시간 단축.")
        .build());

        Seller s7 = sellerRepository.save(Seller.builder()
        .member(members.get(15))
        .sname("킥센터")
        .slocation("서울특별시 서초구 반포대로 245")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s7)
        .introContent("센터 전용 킥복/공/장비 제공, 정기고객 혜택")
        .simage(folderPath + "/ss7.webp," + folderPath + "/s13.jpg," + folderPath + "/s14.jpg")
        .hiredCount(0)
        .info("풋살센터 전용 렌탈 시스템 구축, 장비 분실 및 손상 보장 옵션 포함. 정기 고객 할인제도 운영.")
        .build());

        Seller s8 = sellerRepository.save(Seller.builder()
        .member(members.get(16))
        .sname("K-풋살렌탈")
        .slocation("서울특별시 동대문구 천호대로 81")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s8)
        .introContent("K-리그 연계 장비 패키지, 고급형 구성")
        .simage(folderPath + "/ss8.webp," + folderPath + "/s15.jpg," + folderPath + "/s16.jpg")
        .hiredCount(0)
        .info("국내 대형 리그 연계 렌탈, 인증 받은 정품 장비")
        .build());

        Seller s9 = sellerRepository.save(Seller.builder()
        .member(members.get(17))
        .sname("킥플러스")
        .slocation("서울특별시 영등포구 국회대로 112")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s9)
        .introContent("풀패키지 킥 장비 + 유니폼 구성")
        .simage(folderPath + "/ss9.webp," + folderPath + "/s17.jpg," + folderPath + "/s18.jpg")
        .hiredCount(0)
        .info("초보자부터 실전 팀까지 모두 만족할 수 있는 풀서비스 렌탈 플랫폼. 장비 + 유니폼 + 팀명 인쇄 옵션 제공.")
        .build());

        Seller s10 = sellerRepository.save(Seller.builder()
        .member(members.get(18))
        .sname("더풋렌탈")
        .slocation("서울특별시 은평구 연서로 57")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s10)
        .introContent("여성 팀 대상 맞춤 장비 포함")
        .simage(folderPath + "/ss10.webp," + folderPath + "/s19.jpg," + folderPath + "/s20.jpg")
        .hiredCount(0)
        .info("다양한 체형에 맞춘 사이즈 옵션 보유")
        .build());

        Seller s11 = sellerRepository.save(Seller.builder()
        .member(members.get(19))
        .sname("이노킥(InnoKick)")
        .slocation("서울특별시 광진구 능동로 145")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s11)
        .introContent("이노킥의 장비는 사용 이력 관리가 철저하여 항상 최상의 상태를 유지합니다. 주기적인 정비와 위생 처리가 기본입니다.")
        .simage(folderPath + "/ss11.webp," + folderPath + "/s21.jpg," + folderPath + "/s22.jpg")
        .hiredCount(0)
        .info("정기적으로 상태를 점검한 고품질 장비만을 제공하며, 반납 후 자동 알림과 간편한 재예약 시스템으로 재사용이 편리합니다.")
        .build());

        Seller s12 = sellerRepository.save(Seller.builder()
        .member(members.get(20))
        .sname("에이스풋렌탈")
        .slocation("서울특별시 도봉구 마들로 14")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s12)
        .introContent("기본형 세트와 리그 공인 제품 구성")
        .simage(folderPath + "/ss12.webp")
        .hiredCount(0)
        .info("초보자 팀을 위한 가성비 구성, 빠른 응대")
        .build());

        Seller s13 = sellerRepository.save(Seller.builder()
        .member(members.get(21))  
        .sname("K-풋코리아")
        .slocation("서울특별시 강동구 성내로 32길 27")
        .build());
        sellerIntroRepository.save(SellerIntro.builder()
        .seller(s13)
        .introContent("기본 장비 세트 구성, 초심자 대상 서비스 제공")
        .simage("default/default.png") 
        .hiredCount(0)
        .info("풋살 입문자를 위한 합리적 구성과 친절한 상담 서비스")
        .build());


    }

    private String encoded(String raw) {
        return new BCryptPasswordEncoder().encode(raw);
    }

    private void copyImage(String fileName, String folderPath) {
    try {
        Path toDir = Paths.get("C:/upload/" + folderPath); // 목적지 디렉토리
        Files.createDirectories(toDir); // 폴더 없으면 생성

        Path from = Paths.get("src/main/resources/static/dummy/" + fileName); // 더미 이미지 위치
        Path to = toDir.resolve(fileName); // 복사할 위치
        Files.copy(from, to, StandardCopyOption.REPLACE_EXISTING); // 덮어쓰기 복사
    } catch (Exception e) {
        throw new RuntimeException("이미지 복사 실패: " + fileName, e);
    }
}
}
