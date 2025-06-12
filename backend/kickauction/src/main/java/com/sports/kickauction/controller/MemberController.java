package com.sports.kickauction.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
  
  private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberService.existsByUserId(member.getUserId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 이메일입니다.");
        }
        if (memberService.existsByUserName(member.getUserName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 닉네임입니다.");
        }
        if (memberService.existsByPhone(member.getPhone())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 전화번호입니다.");
        }

        memberService.register(member);
        return ResponseEntity.ok("회원가입에 성공했어요.");
    }
    
}
