package com.sports.kickauction.service;

import com.sports.kickauction.entity.Member;

public interface MemberService {

    // 주석: 중복검사용 
    boolean existsByUserId(String userId);
    boolean existsByUserName(String userName);
    boolean existsByPhone(String phone);

    Member register(Member member);
}
