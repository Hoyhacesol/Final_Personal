package com.sports.kickauction.service;

import java.util.Optional;

import com.sports.kickauction.entity.Member;

public interface MemberService {

    Member findById(Long mno);
    Member findByUserId(String userId);
    Optional<Member> findByUserName(String userName);
    
    // 주석: 중복검사용 
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);

    // 주석: 일반회원추가
    Member register(Member member);
    // 주석: 업체회원추가
    void registerSeller(Member member, String sname, String slocation);

    // 주석: 프로필사진 이미지 업로드
    boolean updateProfileImg(Long mno, String newFileName);

    // 주석: 회원정보 업데이트
    void updateMember(Member member);

    // 주석: 전화번호로 이메일 찾기
    Member findByPhone(String phone);

    // 주석: 전화번호+ 이메일로 비밀번호 재설정
    Member findByUserIdAndPhone(String email, String phone);

    // 주석: ROLE변경(USER->SELLER)
    void changeToSeller(Long mno, String sname, String slocation);

    // 주석: ROLE변경(SELEER->SUER)
    void changeToUser(Long mno);

    //주석: 기존 SELLER데이터 소유 회원 SELLER변경
    void updateSeller(Long mno);

    // 주석: 회원탈퇴
    boolean deleteMember(Long mno);

    // 닉네임검색 채팅시작

}
