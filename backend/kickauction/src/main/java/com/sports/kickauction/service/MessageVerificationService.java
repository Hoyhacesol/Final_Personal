package com.sports.kickauction.service;

import org.springframework.stereotype.Service;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;



@Service
public class MessageVerificationService {

    private final DefaultMessageService messageService;

    public MessageVerificationService() {
        this.messageService = NurigoApp.INSTANCE.initialize(
                "NCSN32M4M5XBOVZI",
                "VRESQGEWTLOSN7PKPPLGP0YOISKZNZ1U",
                "https://api.coolsms.co.kr"
        );
    }

    public void sendSms(String to, String content) {
        Message message = new Message();
        message.setFrom("01087772840");  // 발송자
        message.setTo(to);               // 수신자
        message.setText(content);        // 문자내용

        try {
           messageService.send(message); 
        } catch (Exception e) {
            throw new RuntimeException("SMS 전송 실패함: " + e.getMessage());
        }
    }
}