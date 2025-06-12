package com.sports.kickauction.service;

import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    
    private final MemberRepository memberRepository;

    @Override
    public Member register(Member member) {
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