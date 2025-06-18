package com.sports.kickauction.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.service.MessageVerificationService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
public class SMSController {

    private final MessageVerificationService messageVerificationService;

    // 주석: 인증 메세지 보내기
    @PostMapping("/send")
    public ResponseEntity<?> sendAuthCode(@RequestBody Map<String, String> request, HttpSession session) {
        String phone = request.get("phone");

        if (phone == null || phone.length() < 10) {
            return ResponseEntity.badRequest().body("전화번호가 유효하지 않습니다.");
        }

        // 주석:: 인증번호 
        String authCode = String.valueOf((int)((Math.random() * 900000) + 100000)); 
        session.setAttribute("authCode:" + phone, authCode); 

        // 주석:: 인증번호 전송
        messageVerificationService.sendSms(phone, "[킥옥션] 인증번호: " + authCode);

        return ResponseEntity.ok("인증번호 전송 완료");
    }
}