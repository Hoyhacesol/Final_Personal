package com.sports.kickauction.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Member register(Member member) {
        
        // 주석: 사용자 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getUserPw());
        member.setUserPw(encodedPw);

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

}