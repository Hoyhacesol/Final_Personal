package com.sports.kickauction.repository;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Member;

import jakarta.transaction.Transactional;

@SpringBootTest
public class NewMemberTest {
  
  @Autowired
    private MemberRepository memberRepository;

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
                .userName("고척스카이돔")
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
    }

    private String encoded(String raw) {
        return new BCryptPasswordEncoder().encode(raw);
    }
}
