package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

  // 주석: 중복검사용
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);
}