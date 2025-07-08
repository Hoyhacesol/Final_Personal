package com.sports.kickauction.service;

import com.sports.kickauction.dto.BizModifyDTO;
import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.entity.Member;

import java.util.Optional;

public interface BizService {
    Optional<Member> getLoggedInMember();
    void registerBiz(Long mno, BizRegisterDTO dto);
    boolean hasAlreadyBid(Long mno, Long ono);

    Long getSellerMnoByOrderOno(Long ono);

    void deleteBiz(Long mno, Long ono);

    void modifyBiz(Long mno, BizModifyDTO dto);

    BizRegisterDTO getBizDetail(Long mno, Long ono);

    void checkBizEditable(Long mno, Long ono);

    boolean hasDeletedBid(Long mno, int ono);
}
