package com.sports.kickauction.controller;

import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.service.BizService;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biz")
@RequiredArgsConstructor
public class BizController {

    private final BizService bizService;

    //등록
    @PostMapping("/register")
    public ResponseEntity<?> registerBiz(@RequestBody BizRegisterDTO dto) {
        return bizService.getLoggedInMember()
                .map(member -> {
                    if (!"SELLER".equals(member.getRole())) {
                        return ResponseEntity.status(403).body("판매자만 제안을 등록할 수 있습니다.");
                    }
                    try {
                        bizService.registerBiz(member.getMno(), dto);
                        return ResponseEntity.ok("제안 등록 완료");
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                    }
                })
                .orElse(ResponseEntity.status(401).build());
                }
    
        // 입찰 여부 체크 API
        @GetMapping("/check/{ono}")
        public ResponseEntity<?> checkAlreadyBid(@PathVariable Long ono) {
            return bizService.getLoggedInMember()
                    .map(member -> {
                        boolean alreadyBid = bizService.hasAlreadyBid(member.getMno(), ono);
                        return ResponseEntity.ok().body(
                                Map.of("registered", alreadyBid)
                        );
                    })
                    .orElse(ResponseEntity.status(401).build());
        }

    
}
