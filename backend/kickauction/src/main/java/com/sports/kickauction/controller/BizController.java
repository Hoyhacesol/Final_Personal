package com.sports.kickauction.controller;

import com.sports.kickauction.dto.BizModifyDTO;
import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.service.BizService;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biz")
@RequiredArgsConstructor
public class BizController {

    private final BizService bizService;

    //등록
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/register")
    public ResponseEntity<?> registerBiz(@RequestBody BizRegisterDTO dto) {
    return bizService.getLoggedInMember()
            .map(member -> {
                if (!"SELLER".equals(member.getRole())) {
                    return ResponseEntity.status(403).body("판매자만 제안을 등록할 수 있습니다.");
                }
                try {
                    //  삭제 이력 검사 추가
                    if (bizService.hasDeletedBid(member.getMno(), dto.getOno())) {
                        return ResponseEntity.badRequest().body("삭제한 입찰 제안은 재등록할 수 없습니다.");
                    }

                    bizService.registerBiz(member.getMno(), dto);
                    return ResponseEntity.ok("제안 등록 완료");
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
            })
            .orElse(ResponseEntity.status(401).build());
}

    
        // 입찰 여부 체크 API
        @PreAuthorize("isAuthenticated()")
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

        @PreAuthorize("isAuthenticated()")
        @DeleteMapping("/delete/{ono}")
        public ResponseEntity<?> deleteBiz(@PathVariable Long ono) {
            return bizService.getLoggedInMember()
                    .map(member -> {
                        try {
                            bizService.deleteBiz(member.getMno(), ono);
                            return ResponseEntity.ok("입찰 제안이 삭제되었습니다.");
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.badRequest().body(e.getMessage());
                        }
                    })
                    .orElse(ResponseEntity.status(401).build());
                    }
        @PreAuthorize("isAuthenticated()")
        @GetMapping("/{ono}")
        public ResponseEntity<?> getBizDetail(@PathVariable Long ono) {
            return bizService.getLoggedInMember()
                    .map(member -> {
                        try {
                            BizRegisterDTO dto = bizService.getBizDetail(member.getMno(), ono);
                            return ResponseEntity.ok(dto);
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.badRequest().body(e.getMessage());
                        }
                    })
                    .orElse(ResponseEntity.status(401).build());
        }
      @PreAuthorize("isAuthenticated()")
      @PatchMapping("/modify")
      public ResponseEntity<?> modifyBiz(@RequestBody BizModifyDTO dto) {
        return bizService.getLoggedInMember()
                .map(member -> {
                    try {
                        bizService.modifyBiz(member.getMno(), dto);
                        return ResponseEntity.ok("입찰 제안 수정 완료");
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                    }
                })
                .orElse(ResponseEntity.status(401).body("로그인이 필요합니다."));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/check-editable/{ono}")
    public ResponseEntity<?> checkBizModifiable(@PathVariable Long ono) {
        return bizService.getLoggedInMember()
            .map(member -> {
                try {
                    bizService.checkBizEditable(member.getMno(), ono); // 이 메서드는 예외만 던지면 됨
                    return ResponseEntity.ok().build();
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
            })
            .orElse(ResponseEntity.status(401).build());
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/check-deleted/{ono}")
    public ResponseEntity<?> checkDeletedBid(@PathVariable int ono) {
        return bizService.getLoggedInMember()
                .map(member -> {
                    boolean deletedBefore = bizService.hasDeletedBid(member.getMno(), ono);
                    return ResponseEntity.ok(Map.of("deleted", deletedBefore));
                })
                .orElse(ResponseEntity.status(401).build());
    }



    
}
