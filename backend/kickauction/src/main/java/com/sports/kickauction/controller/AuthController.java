package com.sports.kickauction.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;

    @GetMapping("/me")
public ResponseEntity<?> getLoginUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인되지 않음");
    }

    Object principal = authentication.getPrincipal();
    String email = null;

    if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
        // 일반 로그인 사용자
        email = userDetails.getUsername();
    } else if (principal instanceof OAuth2User) {
        // 소셜 로그인 사용자 (구글 or 카카오)
        OAuth2User oAuth2User = (OAuth2User) principal;
        email = (String) oAuth2User.getAttribute("email");

        // 카카오는 kakao_account.email로 들어올 수 있음
        if (email == null) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
            }
        }
    }

    if (email == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 정보 없음");
    }

    Member member = memberRepository.findByUserId(email)
            .orElseThrow(() -> new UsernameNotFoundException("해당 이메일의 회원 없음"));

    return ResponseEntity.ok(Map.of("nickname", member.getUserName()));
}
}
