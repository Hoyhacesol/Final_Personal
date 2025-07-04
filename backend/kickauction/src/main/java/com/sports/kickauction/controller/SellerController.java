package com.sports.kickauction.controller;


import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.dto.SellerModifyDTO;
import com.sports.kickauction.dto.SellerModifyReadDTO;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.dto.SellerRegisterReadDTO;
import com.sports.kickauction.entity.Member;

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

    @GetMapping("/detail")
    public SellerReadDTO getSeller(@RequestParam("mno") Long mno) {
        return sellerService.getSellerByMno(mno);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/register")
    public ResponseEntity<?> registerSeller(@RequestBody SellerRegisterDTO dto) {
    return sellerService.getLoggedInMember().map(member -> {
        if (!"SELLER".equals(member.getRole())) {
            return ResponseEntity.status(403).body("업체 회원만 등록할 수 있습니다.");
        }
        try {
            sellerService.registerSeller(member.getMno(), dto);
            return ResponseEntity.ok("등록 완료");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }).orElse(ResponseEntity.status(401).build());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/registered")
    public ResponseEntity<Boolean> checkRegistered() {
    return sellerService.getLoggedInMember()
        .map(member -> ResponseEntity.ok(sellerService.isAlreadyRegistered(member.getMno())))
        .orElse(ResponseEntity.status(401).build());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/register-info")
    public ResponseEntity<?> getSellerRegisterInfo() {
    Optional<Member> optionalMember = sellerService.getLoggedInMember();
    if (optionalMember.isEmpty()) {
        return ResponseEntity.status(401).build();
    }

    Member member = optionalMember.get();

    if (!"SELLER".equals(member.getRole())) {
        return ResponseEntity.status(403).body("업체 회원만 접근 가능합니다.");
    }

    SellerRegisterReadDTO dto = sellerService.getSellerRegisterInfo(member.getMno());
    return ResponseEntity.ok(dto);
}

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/modify-info")
    public ResponseEntity<?> getSellerModifyInfo() {
    return sellerService.getLoggedInMember()
        .map(member -> {
            if (!"SELLER".equals(member.getRole())) {
                return ResponseEntity.status(403).body("업체 회원만 접근 가능합니다.");
            }

            try {
                SellerModifyReadDTO dto = sellerService.getSellerModifyInfo(member.getMno());
                return ResponseEntity.ok(dto);
            } catch (NoSuchElementException e) {
                return ResponseEntity.status(404).body(e.getMessage());
            }
        })
        .orElse(ResponseEntity.status(401).build());
    }


    @PreAuthorize("isAuthenticated()")
    @PutMapping("/modify")
    public ResponseEntity<?> modifySeller(@RequestBody SellerModifyDTO dto) {
    return sellerService.getLoggedInMember()
        .map(member -> {
            if (!"SELLER".equals(member.getRole())) {
                return ResponseEntity.status(403).body("업체 회원만 수정할 수 있습니다.");
            }

            try {
                sellerService.modifySeller(member.getMno(), dto);
                return ResponseEntity.ok("수정 완료");
            } catch (NoSuchElementException e) {
                return ResponseEntity.status(404).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(400).body("수정 중 오류 발생");
            }
        })
        .orElse(ResponseEntity.status(401).build());
    }

}
   

