package com.sports.kickauction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.service.ReviewService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ReviewDTO dto) {
        service.register(dto);
        return ResponseEntity.ok().build();
    }
}
