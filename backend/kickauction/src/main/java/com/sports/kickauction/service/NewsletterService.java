package com.sports.kickauction.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final JavaMailSender mailSender;

    public void sendSubscriptionEmail(String toEmail) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("KickAuction 구독 완료");
        msg.setText("안녕하세요!\nKickAuction 구독이 완료되었습니다. 감사합니다.");
        mailSender.send(msg);
    }
}
