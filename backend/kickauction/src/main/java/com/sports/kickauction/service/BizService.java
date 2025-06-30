package com.sports.kickauction.service;

import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.entity.Member;

import java.util.Optional;

public interface BizService {
    Optional<Member> getLoggedInMember();
    void registerBiz(Long mno, BizRegisterDTO dto);
    boolean hasAlreadyBid(Long mno, Long ono);
}
