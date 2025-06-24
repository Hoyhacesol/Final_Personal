package com.sports.kickauction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.Authentication;

import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.dto.SellerRegisterReadDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.service.MemberDetails;
import com.sports.kickauction.service.SellerService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    
    private final SellerService sellerService;
    private final MemberRepository memberRepository;
    
    @GetMapping("/list")
    public ResponseEntity<SellerPageResponseDTO<SellerReadDTO>> getSellerList(SellerPageRequestDTO sellerPageRequestDTO) {
        SellerPageResponseDTO<SellerReadDTO> result = sellerService.getSellerList(sellerPageRequestDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail")
    public SellerReadDTO getSeller(@RequestParam("mno") Long mno) {
        return sellerService.getSellerByMno(mno);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerSeller(@RequestBody SellerRegisterDTO dto) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
        return ResponseEntity.status(401).build();
    }

    String userId = auth.getName(); // 세션에서 로그인된 userId 가져오기

    Member member = memberRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("회원 정보 없음"));

    if (!"SELLER".equals(member.getRole())) {
        return ResponseEntity.status(403).body("업체 회원만 등록할 수 있습니다.");
    }

    try {
        sellerService.registerSeller(member.getMno(), dto);
        return ResponseEntity.ok("등록 완료");
    } catch (IllegalStateException e) {
        return ResponseEntity.status(403).body(e.getMessage());
    }
}

    @GetMapping("/registered")
    public ResponseEntity<Boolean> checkRegistered() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    
    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
        return ResponseEntity.status(401).build();
    }

    String userId = null;

    // 주석: OAuth2User 처리
    if (auth.getPrincipal() instanceof OAuth2User) {
        OAuth2User oauthUser = (OAuth2User) auth.getPrincipal();
        userId = (String) oauthUser.getAttributes().get("user_id"); 
    } else {
        userId = auth.getName(); 
    }

    Member member = memberRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("회원 정보 없음"));

    return ResponseEntity.ok(sellerService.isAlreadyRegistered(member.getMno()));
}
   
@GetMapping("/register-info")
public ResponseEntity<?> getSellerRegisterInfo() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
        return ResponseEntity.status(401).build();
    }

    String userId = auth.getName();
    Member member = memberRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("회원 정보 없음"));

    // SELLER만 접근 가능
    if (!"SELLER".equals(member.getRole())) {
        return ResponseEntity.status(403).body("판매자 회원만 접근 가능합니다.");
    }

    SellerRegisterReadDTO dto = sellerService.getSellerRegisterInfo(member.getMno());
    return ResponseEntity.ok(dto);
}
}
   

