package com.sports.kickauction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.service.SellerService;


import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    
    private final SellerService sellerService;
    
    @GetMapping("/list")
    public ResponseEntity<SellerPageResponseDTO<SellerReadDTO>> getSellerList(SellerPageRequestDTO sellerPageRequestDTO) {
        SellerPageResponseDTO<SellerReadDTO> result = sellerService.getSellerList(sellerPageRequestDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail/{mno}")
    public SellerReadDTO getSeller(@PathVariable Long mno) {
        return sellerService.getSellerByMno(mno);
    }

    @PostMapping("/register/{mno}")
    public ResponseEntity<?> registerSeller(@PathVariable Long mno,@RequestBody SellerRegisterDTO dto) {
    sellerService.registerSeller(mno, dto);
    return ResponseEntity.ok("등록 완료");
    }
   
}
   

