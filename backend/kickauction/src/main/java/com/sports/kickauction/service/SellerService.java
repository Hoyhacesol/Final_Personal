package com.sports.kickauction.service;

import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;

public interface SellerService {
    SellerReadDTO getSellerByMno(Long mno);
    void registerSeller(Long mno, SellerRegisterDTO dto);
    SellerPageResponseDTO<SellerReadDTO> getSellerList(SellerPageRequestDTO sellerPageRequestDTO);
}
