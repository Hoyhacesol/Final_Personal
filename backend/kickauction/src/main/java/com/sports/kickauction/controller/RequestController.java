package com.sports.kickauction.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.service.RequestService;



@RestController
@RequestMapping("/api/orders")
public class RequestController {

    @Autowired
    private RequestService requestService;

    private final MemberRepository memberRepository;

    public RequestController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
    

    // 견적 상세 조회 (GET /api/orders/{ono})
    @GetMapping("/{ono}") // PathVariable 이름 소문자 'ono'로 수정
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable("ono") int ono) { // @PathVariable 이름 소문자 'ono'로 수정
        RequestDTO order = requestService.getOrderDetails(ono); // 서비스 메서드 호출

        if (order != null) {
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("ono", order.getOno());
            responseMap.put("mno", order.getMno());
            responseMap.put("sport", order.getPlayType()); // "playType"을 "sport"로 매핑
            responseMap.put("region", order.getOlocation()); // "olocation"을 "region"으로 매핑

            // rentalDate와 rentalTime을 datetime으로 합쳐서 전달
            String datetimeString = "";
            if (order.getRentalDate() != null) {
                datetimeString += order.getRentalDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            }
            if (order.getRentalTime() != null && !order.getRentalTime().isEmpty()) {
                datetimeString += "|" + order.getRentalTime();
            }
            responseMap.put("datetime", datetimeString);

            responseMap.put("people", order.getPerson() != null ? order.getPerson().toString() + "명" : null); // "person"을 "people"로, "명" 추가
            responseMap.put("rentalItems", order.getRentalEquipment()); // "rentalEquipment"을 "rentalItems"로
            responseMap.put("detail", order.getOcontent()); // "ocontent"를 "detail"로
            responseMap.put("request", order.getOcontent()); // "ocontent"를 "request"로
            responseMap.put("regdate", order.getRegdate()); // "regdate" 추가
            responseMap.put("finished", order.getFinished()); // "finished" 추가

            // 업체 목록 (companies)은 getOrderDetails 응답에 포함되지 않으므로,
            // 별도의 API 호출이 필요하거나 OrderDTO/RequestDTO에 포함되어야 합니다.
            // 여기서는 임시로 빈 배열을 넣거나, 이 로직을 제거할 수 있습니다.
            responseMap.put("companies", new String[]{}); // 예시로 빈 배열

            return ResponseEntity.ok(responseMap);
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // 견적 수정 (PATCH /api/orders/{ono})
    @PatchMapping("/{ono}") // PathVariable 이름 소문자 'ono'로 수정
    public ResponseEntity<String> updateOrder(@PathVariable("ono") int ono, @RequestBody RequestDTO requestDTO) { // @PathVariable 이름 소문자 'ono'로 수정
        // ono 값을 DTO에 설정하여 서비스로 전달
        requestDTO.setOno(ono);

        // datetime 문자열을 파싱하여 DTO의 rentalDate와 rentalTime 필드에 설정
        String datetimeFromFrontend = (String) requestDTO.getAttributes().get("datetime"); // 예시: 프론트엔드에서 "datetime" 키로 보낸다고 가정
        if (requestDTO.getAttributes() != null && requestDTO.getAttributes().containsKey("datetime")) {
            requestService.parseDateTimeAndSetOrderDTO(datetimeFromFrontend, requestDTO);
        }

        // DTO 필드명과 DB 컬럼명 매핑 (컨트롤러에서 수행)
        // RequestDTO의 sport를 playType으로
        // RequestDTO의 region을 olocation으로
        // RequestDTO의 request를 ocontent로

        boolean updated = requestService.updateOrder(requestDTO); // 서비스 메서드 호출

        if (updated) {
            return ResponseEntity.ok("견적이 성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("견적을 찾을 수 없거나 수정에 실패했습니다.");
        }
    }

    // 견적 생성 (POST /api/orders) - 프론트엔드 OrderCreatePage.js에서 호출될 API
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder (@RequestBody RequestDTO requestDTO) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username;

        // 2. principal에서 username 추출
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString(); // 일반 문자열일 경우
        }

        // 3. MemberRepository를 통해 Member 조회
        Member member = memberRepository.findByUserId(username)
                        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // 4. 요청 객체에 회원 번호 설정
        requestDTO.setMno(member.getMno().intValue());
        


        // datetime 문자열 파싱 (수정 시와 동일)
        String datetimeFromFrontend = (String) requestDTO.getAttributes().get("datetime");
        if (requestDTO.getAttributes() != null && requestDTO.getAttributes().containsKey("datetime")) {
            requestService.parseDateTimeAndSetOrderDTO(datetimeFromFrontend, requestDTO);
        }

        // DTO 필드명과 DB 컬럼명 매핑
        // RequestDTO의 sport를 playType으로
        // RequestDTO의 region을 olocation으로
        // RequestDTO의 request를 ocontent로

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
        
        User user = (User) authentication.getPrincipal();
        String loginUserId = user.getUsername();
        
        Member member = memberRepository.findByUserId(loginUserId)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + loginUserId));

        int memberNo = member.getMno().intValue();
        System.out.println(memberNo);

        Map<String, Object> myOrdersData = requestService.getMyOrdersByMemberNo(memberNo);

        if (myOrdersData != null && !myOrdersData.isEmpty()) {
            return ResponseEntity.ok(myOrdersData);
        } else {
            return ResponseEntity.noContent().build(); // 내용 없음 (204 No Content)
        }
    }
}