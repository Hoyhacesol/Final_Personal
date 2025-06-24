package com.sports.kickauction.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.MemberSellerDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.service.MemberService;
import com.sports.kickauction.service.SellerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
  
  private final MemberService memberService;
  private final SellerService sellerService;

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
        String uploadDir = "C:/upload/";

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

    // 매핑: 회원정보 업데이트
    @PutMapping("/update")
    public ResponseEntity<?> updateMember(
        @RequestParam Long mno,
        @RequestParam String userName,
        @RequestParam(required = false) String userPw,
        @RequestParam String phone,
        @RequestParam(required = false) MultipartFile profileimg,
        @RequestParam(required = false) String remove
    ) {
        try {
            Member existing = memberService.findById(mno);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }
            if (!existing.getUserName().equals(userName) && memberService.existsByUserName(userName)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 닉네임입니다.");
            }
            if (!Objects.equals(existing.getPhone(), phone) && memberService.existsByPhone(phone)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 전화번호입니다.");
            }

            // 수정 적용
            existing.setUserName(userName);
            existing.setPhone(phone);
            if (userPw != null && !userPw.isBlank()) {
            existing.setUserPw(userPw);
            }

            // 파일 업로드 경로
                String uploadDir = "C:/upload/";
                String currentImg = existing.getProfileimg();

            // 1) 프로필 이미지 삭제 요청 처리
                if ("true".equals(remove)) {
                    if (currentImg != null && !currentImg.equals("baseprofile.png")) {
                        File oldFile = new File(uploadDir + currentImg);
                        if (oldFile.exists()) oldFile.delete();
                    }
                    existing.setProfileimg("baseprofile.png");
                }

                // 2) 새 프로필 이미지 업로드 처리
                else if (profileimg != null && !profileimg.isEmpty()) {
                    // 기존 이미지 삭제
                    if (currentImg != null && !currentImg.equals("baseprofile.png")) {
                        File oldFile = new File(uploadDir + currentImg);
                        if (oldFile.exists()) oldFile.delete();
                    }

                    String ext = profileimg.getOriginalFilename()
                            .substring(profileimg.getOriginalFilename().lastIndexOf("."));
                    String newFileName = UUID.randomUUID() + ext;
                    File dest = new File(uploadDir + newFileName);
                    profileimg.transferTo(dest);

                    existing.setProfileimg(newFileName);
                }

            memberService.updateMember(existing);
            return ResponseEntity.ok(Map.of("filename", existing.getProfileimg()));

        } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 처리 중 오류 발생");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
            }
    }

    // 매핑: 전화번호 입력받아 이메일 찾기

    @GetMapping("/find-id")
    public ResponseEntity<?> findEmailByPhone(@RequestParam String phone) {
        Member member = memberService.findByPhone(phone);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 번호로 저장된 회원 데이터를 찾을 수 없어요😥");
        }
        // 이메일 반환(마스킹처리됨)
        String maskedEmail = maskEmail(member.getUserId());
        return ResponseEntity.ok(Map.of("email", maskedEmail));
    }

    // 이메일 마스킹
    private String maskEmail(String email) {
    int atIndex = email.indexOf("@");
    if (atIndex <= 2) {
        return "*".repeat(atIndex) + email.substring(atIndex);
    }
    return "**" + email.substring(2);
}

// 매핑: 이메일, 전화번호 인증 후 비밀번호 재설정
@PutMapping("/reset_password")
public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String phone = request.get("phone").replaceAll("-", ""); 
    String newPw = request.get("newPw");

    Member member = memberService.findByUserIdAndPhone(email, phone);
    if (member == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 정보로 가입된 사용자를 찾을 수 없습니다.");
    }

    member.setUserPw(newPw); 
    memberService.updateMember(member);

    return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
}

    // 매핑: 마이페이지- ROLE변경(->seller)
    @PatchMapping("/changetoseller")
    public ResponseEntity<?> changetoseller(
           @RequestParam Long mno,
           @RequestParam(required = false) String sname,
           @RequestParam(required = false) String slocation) {
         
        if (!sellerService.existsSeller(mno)) {
        if (sname == null || slocation == null) {
            return ResponseEntity.badRequest().body("sname과 slocation이 필요합니다.");
        }
        memberService.changeToSeller(mno, sname, slocation);
        } else {
            memberService.updateSeller(mno);
        }
          return ResponseEntity.ok("변경 완료");
    }

    // 매핑: 마이페이지- ROLE변경(->user)
    @PatchMapping("/changetouser")
    public ResponseEntity<?> changetouser(@RequestParam Long mno) {
          memberService.changeToUser(mno);
          return ResponseEntity.ok("변경 완료");
    }

    // 매핑: seller로 변경된 회원의 seller데이터 조회 
    @GetMapping("/checkseller")
    public ResponseEntity<?> checkSellerExists(@RequestParam Long mno) {
        boolean exists = sellerService.existsSeller(mno);
        return ResponseEntity.ok(Map.of("exists", exists));
    }


}
