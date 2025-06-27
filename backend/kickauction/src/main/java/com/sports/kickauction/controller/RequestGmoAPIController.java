package com.sports.kickauction.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

import lombok.extern.log4j.Log4j2;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Log4j2
@RestController
@RequestMapping("/api/vworld")
public class RequestGmoAPIController {
  
  //광역시도 2D데이터 API
  private final String API_KEY = "1E326A45-DF11-3FE3-9017-6FE23604AA12"; // 반드시 실제 발급된 API 키로 교체하세요
  @GetMapping("/sido")
  public ResponseEntity<String> getSidoData() {
      try {
          String apiUrl = UriComponentsBuilder
            .fromHttpUrl("https://api.vworld.kr/req/data")
            .queryParam("key", API_KEY)
            .queryParam("domain", "http://localhost:3000")
            .queryParam("service", "data")
            .queryParam("version", "2.0")
            .queryParam("request", "GetFeature")
            .queryParam("format", "json")
            .queryParam("size", "1000")
            .queryParam("page", "1")
            .queryParam("geometry", "false")
            .queryParam("attribute", "true")
            .queryParam("crs", "EPSG:4326")
            .queryParam("geomFilter", "BOX(124,33,132,43)")
            .queryParam("data", "LT_C_ADSIDO_INFO")
            .toUriString();

          RestTemplate restTemplate = new RestTemplate();
          String response = restTemplate.getForObject(apiUrl, String.class);
          return ResponseEntity.ok(response);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("외부 API 요청 실패: " + e.getMessage());
      }
  }

  @GetMapping("/sigungu")
  public ResponseEntity<String> getSigunguData(@RequestParam String sidoName) {
      try {
        
        String apiUrl = UriComponentsBuilder
        .fromHttpUrl("https://api.vworld.kr/req/data")
        .queryParam("key", API_KEY)
        .queryParam("domain", "http://localhost:3000")
            .queryParam("service", "data")
            .queryParam("version", "2.0")
            .queryParam("request", "GetFeature")
            .queryParam("format", "json")
            .queryParam("size", "1000")
            .queryParam("page", "1")
            .queryParam("geometry", "false")
            .queryParam("attribute", "true")
            .queryParam("crs", "EPSG:4326")
            .queryParam("data", "LT_C_ADSIGG_INFO")
            .queryParam("attrFilter", "")
            .toUriString();
            
            //한글은 두번 인코딩되면 안되기 때문에 따로 설정
            String attrFilterValue = "full_nm:like:" + sidoName;
            apiUrl = apiUrl+attrFilterValue+"%";
            // log.info("API 호출 URL: " + apiUrl); // 디버깅 로그

          RestTemplate restTemplate = new RestTemplate();
          String response = restTemplate.getForObject(apiUrl, String.class);
          // System.out.println("=== vworld 응답 ===");
          // System.out.println(response);
          return ResponseEntity.ok(response);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("시군구 API 요청 실패: " + e.getMessage());
      }
  }



  //데이터 형식 체크 TEST코드
  // @GetMapping("/sidoNames")
  // public ResponseEntity<?> getSidoNames() {
  //     try {
  //         String apiUrl = UriComponentsBuilder
  //             .fromHttpUrl("https://api.vworld.kr/req/data")
  //             .queryParam("key", API_KEY)
  //             .queryParam("domain", "http://localhost:3000")
  //             .queryParam("service", "data")
  //             .queryParam("request", "GetFeature")
  //             .queryParam("data", "LT_C_ADSIDO_INFO")
  //             .queryParam("geometry", "false")
  //             .queryParam("attribute", "true")
  //             .queryParam("format", "json")
  //             .queryParam("geomFilter", "BOX(124,33,132,43)")
  //             .toUriString();

  //         RestTemplate restTemplate = new RestTemplate();
  //         String response = restTemplate.getForObject(apiUrl, String.class);
  //         System.out.println("=== vworld 응답 ===");
  //         System.out.println(response); // ✅ 여기에서 전체 JSON 확인
  //         return ResponseEntity.ok(response);

  //     } catch (Exception e) {
  //         Map<String, String> errorResponse = new HashMap<>();
  //         errorResponse.put("error", "시도 이름 조회 실패: " + e.getMessage());
  //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  //     }
  // }

  // @GetMapping("/allSigungu")
  // public ResponseEntity<?> getAllSigungu() {
  //     try {
  //         String apiUrl = UriComponentsBuilder
  //             .fromHttpUrl("https://api.vworld.kr/req/data")
  //             .queryParam("key", API_KEY)
  //             .queryParam("domain", "http://localhost:3000")
  //             .queryParam("service", "data")
  //             .queryParam("version", "2.0")
  //             .queryParam("request", "GetFeature")
  //             .queryParam("data", "LT_C_ADSIGG_INFO")
  //             .queryParam("format", "json")
  //             .queryParam("geometry", "false")
  //             .queryParam("attribute", "true")
  //             .queryParam("geomFilter", "BOX(124,33,132,43)")
  //             .queryParam("size", "100")
  //             .queryParam("page", "1")
  //             .toUriString();

  //         RestTemplate restTemplate = new RestTemplate();
  //         String response = restTemplate.getForObject(apiUrl, String.class);
  //         System.out.println("=== vworld 응답 ===");
  //         System.out.println(response); // ✅ 여기에서 전체 JSON 확인
  //         return ResponseEntity.ok(response);

  //     } catch (Exception e) {
  //         Map<String, String> errorResponse = new HashMap<>();
  //         errorResponse.put("error", "전체 시군구 조회 실패: " + e.getMessage());
  //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  //     }
  // }



}
