package com.sports.kickauction.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.dto.RequestPageCustomReqDTO;
import com.sports.kickauction.dto.RequestPageCustomResDTO;
import com.sports.kickauction.dto.RequestPageRequestDTO;
import com.sports.kickauction.dto.RequestPageResponseDTO;
import com.sports.kickauction.dto.RequestReadDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.MessageRepository;
import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.service.MessageService;
import com.sports.kickauction.service.RequestService;

import lombok.extern.log4j.Log4j2;


@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Log4j2
@RestController
@RequestMapping("/api/orders")
public class RequestController {

    private final RequestRepository requestRepository;
    private final MessageRepository messageRepository;
    private final MessageService messageService;

    @Autowired
    private RequestService requestService;

    private final MemberRepository memberRepository;

    public RequestController(MemberRepository memberRepository, RequestRepository requestRepository, MessageRepository messageRepository, MessageService messageService) {
        this.memberRepository = memberRepository;
        this.requestRepository = requestRepository;
        this.messageRepository = messageRepository;
        this.messageService = messageService;
    }
    //견적 리스트
    @GetMapping("/list")
    public ResponseEntity<RequestPageResponseDTO<RequestReadDTO>> getOrderList(RequestPageRequestDTO requestPageRequestDTO) {
        RequestPageResponseDTO<RequestReadDTO> result = requestService.getOrderList(requestPageRequestDTO);
        return ResponseEntity.ok(result);
    }
    
    // 견적 상세 조회 (GET /api/orders/{ono})
    @GetMapping("/{ono}") // PathVariable 이름 소문자 'ono'로 수정
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable("ono") int ono) { // @PathVariable 이름 소문자 'ono'로 수정
        RequestDTO order = requestService.getOrderDetails(ono); // 서비스 메서드 호출

        if (order != null) {
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("ono", order.getOno());
            responseMap.put("mno", order.getMno());
            responseMap.put("otitle", order.getOtitle());
            responseMap.put("playType", order.getPlayType());
            responseMap.put("region", order.getOlocation()); // "olocation"을 "region"으로 매핑

            String datetimeString = "";
            if (order.getRentalDate() != null) {
                datetimeString += order.getRentalDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            }
            if (order.getRentalTime() != null && !order.getRentalTime().isEmpty()) {
                datetimeString += "|" + order.getRentalTime();
            }
            // rentalDate와 rentalTime을 datetime으로 합쳐서 전달
            responseMap.put("datetime", datetimeString);
            responseMap.put("rentalDate", order.getRentalDate());
            responseMap.put("rentalTime", order.getRentalTime());
            responseMap.put("person", order.getPerson());
            responseMap.put("rentalEquipment", order.getRentalEquipment());
            responseMap.put("ocontent", order.getOcontent());
            responseMap.put("oregdate", order.getOregdate());
            responseMap.put("finished", order.getFinished());

            responseMap.put("companies", order.getAttributes().get("companies"));

            return ResponseEntity.ok(responseMap);
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // 견적 수정 (PATCH /api/orders/{ono})
    @PatchMapping("/{ono}")
    public ResponseEntity<String> updateOrder(@PathVariable("ono") int ono, @RequestBody RequestDTO requestDTO) { // @PathVariable 이름 소문자 'ono'로 수정
        // ono 값을 DTO에 설정하여 서비스로 전달
        requestDTO.setOno(ono);

        boolean updated = requestService.updateOrder(requestDTO); // 서비스 메서드 호출

        if (updated) {
            return ResponseEntity.ok("수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("견적을 찾을 수 없거나 수정에 실패했습니다.");
        }
    }

    // 견적 생성 (POST /api/orders) - 프론트엔드 OrderCreatePage.js에서 호출될 API
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder (@RequestBody RequestDTO requestDTO) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String loginUserId;

        if (principal instanceof org.springframework.security.core.userdetails.User) {
            // 일반 로그인
            loginUserId = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        } 
        else if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) principal;
            Map<String, Object> attributes = oauthUser.getAttributes();

            String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId(); // "google", "kakao" 등

            if ("google".equals(registrationId)) {
                loginUserId = (String) attributes.get("user_id");
            } else if ("kakao".equals(registrationId)) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                loginUserId = (String) kakaoAccount.get("email");
            } else {
                throw new RuntimeException("지원하지 않는 소셜 로그인 방식입니다: " + registrationId);
            }
        } 
        else {
            loginUserId = null;
            throw new RuntimeException("알 수 없는 사용자 인증 방식입니다: " + principal.getClass());
        }
        
        // 3. MemberRepository를 통해 Member 조회
        Member member = memberRepository.findByUserId(loginUserId)
                        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // 4. 요청 객체에 회원 번호 설정
        Long memberMno = member.getMno();
        requestDTO.setMno(memberMno.intValue());

        boolean created = requestService.createOrder(requestDTO);

        if (created) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "견적 요청이 성공적으로 생성되었습니다.");
            response.put("ono", requestDTO.getOno()); // 서비스에서 ono가 DTO에 설정되어 반환됨
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } 
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "견적 생성에 실패했습니다."));
        }
    }

    // 내 견적 목록 조회 (GET /api/orders/my-orders) - 프론트엔드 OrderMyPage.js에서 호출될 API
    @GetMapping("/my-orders")
    public ResponseEntity<Map<String, Object>> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // 일반 로그인에는 문제가 없지만 소셜 로그인 시 USER타입 객체로 변환이 불가능하기 때문에 오류가 발생
        // User user = (User) authentication.getPrincipal();
        // String loginUserId = user.getUsername();

        Object principal = authentication.getPrincipal();
        String loginUserId;
        
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            // 일반 로그인
            loginUserId = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        } 
        else if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) principal;

            Map<String, Object> attributes = oauthUser.getAttributes();

            String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId(); // "google", "kakao" 등

            if ("google".equals(registrationId)) {
                loginUserId = (String) attributes.get("user_id");
            } else if ("kakao".equals(registrationId)) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                loginUserId = (String) kakaoAccount.get("email");
            } else {
                throw new RuntimeException("지원하지 않는 소셜 로그인 방식입니다: " + registrationId);
            }
        } 
        else {
            loginUserId = null;
            throw new RuntimeException("알 수 없는 사용자 인증 방식입니다: " + principal.getClass());
        }
            
   
        Member member = memberRepository.findByUserId(loginUserId)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + loginUserId));

        int memberNo = member.getMno().intValue();

        Map<String, Object> myOrdersData = requestService.getMyOrdersByMemberNo(memberNo);

        if (myOrdersData != null && !myOrdersData.isEmpty()) {
            return ResponseEntity.ok(myOrdersData);
        } else {
            return ResponseEntity.noContent().build(); // 내용 없음 (204 No Content)
        }
    }

    // 내 견적 목록 페이징 조회 (GET /api/orders/my-orders/paginated?status=active&page=1)
    @SuppressWarnings("unchecked")
    @GetMapping("/my-orders/paginated")
    public ResponseEntity<?> getMyOrdersPaginated(RequestPageCustomReqDTO requestPageCustomReqDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Object principal = authentication.getPrincipal();
        String loginUserId;

        if (principal instanceof org.springframework.security.core.userdetails.User) {
            loginUserId = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        } else if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) principal;
            Map<String, Object> attributes = oauthUser.getAttributes();
            String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

            if ("google".equals(registrationId)) {
                loginUserId = (String) attributes.get("user_id");
            } else if ("kakao".equals(registrationId)) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                loginUserId = (String) kakaoAccount.get("email");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("지원하지 않는 소셜 로그인 방식입니다.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 사용자 인증 방식입니다.");
        }

        if (requestPageCustomReqDTO.getStatus() == null || requestPageCustomReqDTO.getStatus().isBlank()) {
            return ResponseEntity.badRequest().body("견적 상태(status)는 필수입니다.");
        }

        try {
            Member member = memberRepository.findByUserId(loginUserId)
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + loginUserId));
            RequestPageCustomResDTO<RequestDTO> response = requestService.getMyOrdersByStatusPaginated(member.getMno().intValue(), requestPageCustomReqDTO);
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * 견적에 대한 업체를 확정합니다.
     * @param ono 견적 ID
     * @param payload 요청 본문, "companyId" 키로 선택된 업체의 mno를 포함
     * @param authentication 현재 로그인한 사용자 정보
     * @return 처리 결과 메시지
     */
    @PatchMapping("/{ono}/select")
    public ResponseEntity<Map<String, String>> selectCompany(
            @PathVariable("ono") int ono,
            @RequestBody Map<String, Long> payload,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
        }

        // 1. 프론트엔드로부터 선택된 업체의 ID(mno)를 받습니다.
        Long sellerMno = payload.get("companyId"); // JS의 companyId
        if (sellerMno == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "companyId가 필요합니다."));
        }

        try {
            // 2. 현재 로그인한 사용자(의뢰자)와 선택된 업체(제안자)의 Member 정보를 DB에서 조회합니다.
            String currentUserId = authentication.getName();
            Member requester = memberRepository.findByUserId(currentUserId)
                    .orElseThrow(() -> new UsernameNotFoundException("현재 로그인된 사용자를 찾을 수 없습니다: " + currentUserId));

            Member provider = memberRepository.findById(sellerMno)
                    .orElseThrow(() -> new UsernameNotFoundException("선택된 업체 정보를 찾을 수 없습니다: " + sellerMno));

            // 3. DB에서 조회한 안전한 정보로 메시지 내용을 생성합니다.
            String messageContent = String.format(
                "[킥옥션 자동발송]\n%s님이 %s님의 제안을 선택했어요.",
                requester.getUserName(), // <의뢰자닉네임>
                provider.getUserName()   // <제안자닉네임>
            );

            // 4. MessageService를 사용하여 메시지를 발송합니다.
            messageService.sendMessage(requester, provider, messageContent);

            // 5. 기존의 업체 확정 로직을 실행합니다.
            requestService.confirmCompanyAndFinalizeOrder(ono, sellerMno);
            return ResponseEntity.ok(Map.of("message", "업체가 성공적으로 확정되었습니다."));
        } catch (Exception e) {
            log.error("업체 확정 중 오류 발생: ono={}, sellerMno={}", ono, sellerMno, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "처리 중 오류가 발생했습니다."));
        }
    }




    // 견적 마감상태 변경 PATCH
    @PatchMapping("/finish/{ono}")
    public ResponseEntity<String> finishOrder(@PathVariable("ono") int ono, @RequestBody RequestDTO requestDTO) {
        // ono 값을 DTO에 설정하여 서비스로 전달
        requestDTO.setOno(ono);
        boolean updated = requestService.updateFinished(requestDTO); // 서비스 메서드 호출
        if (updated) {
            return ResponseEntity.ok("finish PATCH 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("finish PATCH 실패");
        }
    }

    // 견적 취소 요청(논리삭제)
    @PatchMapping("/delete/{ono}")
    public ResponseEntity<String> deleteOrder(@PathVariable("ono") int ono, @RequestBody RequestDTO requestDTO) {
        requestDTO.setOno(ono); // 경로에서 받은 ono를 DTO에 주입
        
        boolean deleted = requestService.deleteOrder(requestDTO);
        if (deleted) {
            return ResponseEntity.ok("논리 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("논리 삭제 실패");
        }
    }


}