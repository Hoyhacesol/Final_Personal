package com.sports.kickauction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Component
@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @PostMapping
    public ResponseEntity<?> askChat(@RequestBody Map<String, Object> request) {
        Object promptObj = request.get("prompt");
        if (promptObj == null || !(promptObj instanceof String prompt) || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "질문이 비어 있거나 올바르지 않습니다."));
        }

        // 1. 요청 body 구성 (gpt-3.5-turbo 기준)
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", "너는 친절한 고객 상담 챗봇이야."));
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);
        System.out.println("사용 중인 openaiApiKey: " + openaiApiKey);
        
        // 2. 헤더 구성
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 3. RestTemplate로 POST 요청
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String url = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> res = restTemplate.postForEntity(url, entity, Map.class);

            // 4. 답변 파싱 (choice → message → content)
            List choices = (List) res.getBody().get("choices");
            if (choices == null || choices.isEmpty())
                return ResponseEntity.ok(Map.of("reply", "답변을 받지 못했습니다."));

            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            String answer = (String) message.get("content");

            return ResponseEntity.ok(Map.of("reply", answer.trim()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("reply", "오류: " + e.getMessage()));
        }
    }
}