package com.sports.kickauction.service;

import java.util.Optional;

import com.sports.kickauction.dto.SellerModifyDTO;
import com.sports.kickauction.dto.SellerModifyReadDTO;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.dto.SellerRegisterReadDTO;
import com.sports.kickauction.entity.Member;

public interface SellerService {
    Optional<Member> getLoggedInMember();
    boolean existsSeller(Long mno);
    SellerReadDTO getSellerByMno(Long mno);
    void registerSeller(Long mno, SellerRegisterDTO dto);
    SellerPageResponseDTO<SellerReadDTO> getSellerList(SellerPageRequestDTO sellerPageRequestDTO);
    boolean isAlreadyRegistered(Long mno);
    SellerRegisterReadDTO getSellerRegisterInfo(Long mno);
    void modifySeller(Long mno,SellerModifyDTO dto);
    SellerModifyReadDTO getSellerModifyInfo(Long mno);
}
