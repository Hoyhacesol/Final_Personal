package com.sports.kickauction.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.SellerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    
    private final MemberRepository memberRepository;
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;

    // 주석: 신규 회원 등록 register()
    @Override
    public Member register(Member member) {
        
        // 주석:: 회원 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getUserPw());
        member.setUserPw(encodedPw);

        // 주석:: 신규 일반 회원가입 유저 SOCIAL값 1로 설정( 소셜 = 0 일반 = 1)
        member.setSocial(1);
        return memberRepository.save(member);
    }

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
    
}   