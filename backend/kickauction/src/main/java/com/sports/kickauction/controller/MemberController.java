package com.sports.kickauction.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.MemberSellerDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
  
  private final MemberService memberService;

    // 매핑:이메일 체크
    @GetMapping("/email_check")
        public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
            boolean exists = memberService.existsByUserId(email);
            return ResponseEntity.ok(Map.of("exists", exists));
        }
    // 매핑:닉네임 체크
    @GetMapping("/nickname_check")
        public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
            boolean exists = memberService.existsByUserName(nickname);
            return ResponseEntity.ok(Map.of("exists", exists));
        }
   
    // 매핑: 회원가입(일반)
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

        // 기본프사설정
        member.setProfileimg("baseprofile.png");

        memberService.register(member);
        return ResponseEntity.ok("환영합니다! 회원가입이 완료되었습니다.");
    }

    //매핑: 회원가입(업체)
    @PostMapping("/signupseller")
    public ResponseEntity<?> registerSeller(@RequestBody MemberSellerDTO dto) {
    if (memberService.existsByUserId(dto.getUserId())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 이메일입니다.");
    }
    if (memberService.existsByUserName(dto.getUserName())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 닉네임입니다.");
    }
    if (memberService.existsByPhone(dto.getPhone())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 전화번호입니다.");
    }

   Member member = Member.builder()
        .userId(dto.getUserId())
        .userName(dto.getUserName())
        .userPw(dto.getUserPw())
        .phone(dto.getPhone())
        .profileimg("baseprofile.png")
        .role("SELLER")
        .build();


    memberService.registerSeller(member, dto.getSname(), dto.getSlocation());

    return ResponseEntity.ok("환영합니다! 회원가입이 완료되었습니다.");
}

    // 매핑: 프로필사진 업로드
    @PostMapping("/upload_profile")
    public ResponseEntity<?> uploadProfileImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam("mno") Long mno) {

    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("빈 파일..");
    }

    try {
        // 파일폴더
        String uploadDir = "C:/uploads/";

        // 파일명:
        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf("."));
        String newFileName = UUID.randomUUID() + ext;

        // 실제 파일 저장
        File dest = new File(uploadDir + newFileName);
        file.transferTo(dest);

        // DB 반영
        boolean success = memberService.updateProfileImg(mno, newFileName);
        if (success) {
            return ResponseEntity.ok(Map.of("filename", newFileName));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없음..");
        }

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패: " + e.getMessage());
    }
}
    
}
