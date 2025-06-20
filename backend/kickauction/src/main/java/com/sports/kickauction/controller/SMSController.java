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
        String phone = request.get("phone").replaceAll("-", "");

        if (phone == null || phone.length() < 10) {
            return ResponseEntity.badRequest().body("전화번호가 유효하지 않습니다.");
        }

        // 주석:: 인증번호 
        String authCode = String.format("%06d", (int)(Math.random() * 1000000));
        session.setAttribute("authCode:" + phone, authCode);  //세션에 인증번호 및 폰번 저장
        session.setAttribute("authCodeExpire:" + phone, System.currentTimeMillis() + 180_000); // 만료시간:3분

        // 주석:: 인증번호 전송
        messageVerificationService.sendSms(phone, "[킥옥션] 인증번호: [" + authCode+"]를 입력해주세요.");

        return ResponseEntity.ok("인증번호 전송 완료");


    }

    // 주석: 인증번호 검증
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request, HttpSession session) {
        String phone = request.get("phone").replaceAll("-", "");
        String inputCode = request.get("code").trim();  //사용자 입력 코드
        String savedCode = (String) session.getAttribute("authCode:" + phone); // 세션에 저장된 전송 인증번호
        Long currentTime = System.currentTimeMillis();          //모달열리고 흐른 시간
        Long expireTime = (Long) session.getAttribute("authCodeExpire:" + phone); //유효시간 


        if (expireTime == null || currentTime > expireTime) {
        session.removeAttribute("authCode:" + phone);
        session.removeAttribute("authCodeExpire:" + phone);
        return ResponseEntity.status(400).body("인증 시간이 만료되었습니다.");
        }

        if (savedCode != null && savedCode.equals(inputCode)) {
            session.removeAttribute("authCode:" + phone);
            session.removeAttribute("authCodeExpire:" + phone);
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(400).body("인증 실패");
        }

        
    }
    
}