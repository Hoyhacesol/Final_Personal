package com.sports.kickauction.service;

import com.sports.kickauction.entity.Member;

public interface MemberService {

    // 주석: 중복검사용 
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);

    // 일반회원추가
    Member register(Member member);
    // 업체회원추가
    void registerSeller(Member member, String sname, String slocation);

    // 프로필사진 이미지 업로드
    boolean updateProfileImg(Long mno, String newFileName);
}
