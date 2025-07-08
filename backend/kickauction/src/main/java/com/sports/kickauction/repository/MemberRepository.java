package com.sports.kickauction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sports.kickauction.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

  // 주석: 중복검사용
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);

  //주석: 로그인 시도 아이디 검색
    Optional<Member> findByUserId(String userId);

  // 주석: 전화번호로 이메일 검색(하이픈무시)
    @Query("SELECT m FROM Member m WHERE REPLACE(m.phone, '-', '') = :phone")
    Optional<Member> findByPhone(@Param("phone") String phone);

  // 주석: 전화번호(하이픈무시)와 이메일로 사용자 검색
  @Query("SELECT m FROM Member m WHERE m.userId = :email AND REPLACE(m.phone, '-', '') = :phone")
  Optional<Member> findByUserIdAndPhone(@Param("email") String email, @Param("phone") String phone);

    Optional<Member> findByUserName(String userName);


    
}