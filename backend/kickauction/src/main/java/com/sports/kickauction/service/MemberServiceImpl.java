package com.sports.kickauction.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.SellerIntroRepository;
import com.sports.kickauction.repository.SellerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    
    private final MemberRepository memberRepository;
    private final SellerRepository sellerRepository;
    private final SellerIntroRepository sellerIntroRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public boolean existsByUserId(String userId) {
        return memberRepository.existsByUserId(userId);
    }

    @Override
    public boolean existsByUserName(String userName) {
        return memberRepository.existsByUserName(userName);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return memberRepository.existsByPhone(phone);
    }

    // 주석: 신규 일반 회원 등록 register()
    @Override
    public Member register(Member member) {
        
        // 주석:: 회원 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getUserPw());
        member.setUserPw(encodedPw);

        // 주석:: 신규 일반 회원가입 유저 SOCIAL값 1로 설정( 소셜 = 0 일반 = 1)
        member.setSocial(1);
        return memberRepository.save(member);
    }

    // 주석: 신규 판매자 등록
    @Override
    @Transactional
    public void registerSeller(Member member, String sname, String slocation) {

        // 주석:: 회원 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getUserPw());
        member.setUserPw(encodedPw);

        // 주석:: 신규 일반 회원가입 유저 SOCIAL값 1로 설정( 소셜 = 0 일반 = 1)
        member.setSocial(1);
        
        memberRepository.save(member);

        // seller 생성 시 mno를 직접 지정하지 말고 member만 주입
        Seller seller = Seller.builder()
            .member(member)
            .sname(sname)
            .slocation(slocation)
            .build();

        sellerRepository.save(seller);
    }

    @Override
    public Member findById(Long mno) {
        return memberRepository.findById(mno).orElse(null);
    }


    // 주석: 프로필 이미지 업로드
    @Override
    public boolean updateProfileImg(Long mno, String newFileName) {
        Optional<Member> opt = memberRepository.findById(mno);
        if (opt.isPresent()) {
            Member member = opt.get();
            member.setProfileimg(newFileName);
            memberRepository.save(member);
            return true;
        }
        return false;
    }

    // 주석: 회원정보 업데이트
    @Override
    public void updateMember(Member member) {
        if (!member.getUserPw().startsWith("$2a$")) {
            String encodedPw = passwordEncoder.encode(member.getUserPw());
            member.setUserPw(encodedPw);
        }  else {
            Member origin = memberRepository.findById(member.getMno()).orElse(null);
            if (origin != null) {
            member.setUserPw(origin.getUserPw());
            }
        }
    // 주석:: 저장
    memberRepository.save(member); 
    }

    // 주석: 전화번호로 이메일 찾기
    @Override
    public Member findByPhone(String phone) {
        return memberRepository.findByPhone(phone).orElse(null);
    }

    // 주석: 전화번호+이메일로 비밀번호 재설정
    @Override
    public Member findByUserIdAndPhone(String email, String phone) {
        return memberRepository.findByUserIdAndPhone(email, phone).orElse(null);
    }

    // 주석: SELLER로 ROLE 변경 (기존데이터 X)
    @Override
    @Transactional
    public void changeToSeller(Long mno, String sname, String slocation) {
        Member member = memberRepository.findById(mno)
        .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        if (member == null) return;

        member.setRole("SELLER");
        memberRepository.save(member);
        
        
        if (sellerRepository.existsById(mno)) {
             return;
        }

        Seller seller = Seller.builder()
        .member(member)
        .sname(sname)
        .slocation(slocation)
        .build();

        sellerRepository.save(seller);
    }

    // 주석: 기존 SELLER데이터 가진 회원 SELLER로 변경 시 
    @Override
    @Transactional
    public void updateSeller(Long mno) {
        Member member = memberRepository.findById(mno).orElse(null);
        if (member != null) {
            member.setRole("SELLER"); 
            memberRepository.save(member);
        }
    }

    // 주석: USER로 ROLE 변경
    @Override
    @Transactional
    public void changeToUser(Long mno) {
    Member member = memberRepository.findById(mno).orElse(null);
    if (member == null) return;

    member.setRole("USER");
    memberRepository.save(member);
    }

    // 주석: 회원탈퇴
    @Transactional
    @Override
    public boolean deleteMember(Long mno) {
    Optional<Member> optional = memberRepository.findById(mno);
    if (optional.isEmpty()) return false;

    Member member = optional.get();

    // 1. SELLER,SELLER_INTRO, ORDER, BIZ, REVIEW 테이블 제거
    sellerIntroRepository.deleteByMno(mno);
    sellerRepository.deleteByMno(mno);
    
    
     // 2. Member테이블 처리
    member.setUserId(null);
    member.setUserPw(null);
    member.setUserName(null);
    member.setPhone(null);
    member.setProfileimg(null);
    member.setSocial(0);
    member.setRole("WITHDRAW");
    memberRepository.save(member);
    
    return true;
    }

}   