package com.sports.kickauction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

  // 주석: 중복검사용
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);

  //주석: 로그인 시도 아이디 검색
    Optional<Member> findByUserId(String userId);
}