package com.sports.kickauction.service;

import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.dto.SellerRegisterReadDTO;

public interface SellerService {
    boolean existsSeller(Long mno);
    SellerReadDTO getSellerByMno(Long mno);
    void registerSeller(Long mno, SellerRegisterDTO dto);
    SellerPageResponseDTO<SellerReadDTO> getSellerList(SellerPageRequestDTO sellerPageRequestDTO);
    boolean isAlreadyRegistered(Long mno);
    SellerRegisterReadDTO getSellerRegisterInfo(Long mno);
}
