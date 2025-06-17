package com.sports.kickauction.service;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Primary
@Service
@RequiredArgsConstructor
public class MemberDetailsService implements UserDetailsService {
  
  private final MemberRepository memberRepository;

  @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByUserId(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: "));

        return User.builder()
        .username(member.getUserId())
        .password(member.getUserPw())  
        .roles("USER")  
        .build();
    }
}