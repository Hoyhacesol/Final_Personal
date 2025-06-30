package com.sports.kickauction.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sports.kickauction.service.NewsletterService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {
    private final NewsletterService service;

    @PostMapping
    public ResponseEntity<String> subscribe(@RequestBody Map<String,String> body) {
        String email = body.get("email");
        // 간단한 이메일 유효성 검사
        if(email == null || !email.matches("^[\\w-.]+@[\\w-]+\\.[a-zA-Z]{2,}$")) {
            return ResponseEntity.badRequest()
                .body("유효하지 않은 이메일 주소입니다.");
        }
        service.sendSubscriptionEmail(email);
        return ResponseEntity.ok("구독 확인 메일 발송 완료");
    }
}
