package com.sports.kickauction.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.dto.SellerReviewReadDTO;
import com.sports.kickauction.service.BizService;
import com.sports.kickauction.service.ReviewService;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
     private final BizService bizService;
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Void> createReview(@RequestBody ReviewDTO dto) {
        // ① BizService를 통해 mno 조회
        Long sellerMno = bizService.getSellerMnoByOrderOno(dto.getOno());

        // ② 조회된 mno로 리뷰 저장
        reviewService.registerReview(
            dto.getOno(),
            sellerMno,
            dto.getRating(),
            dto.getRcontent()
        );

        return ResponseEntity.ok().build();
    }


    // Request >>>>>>>>>>>>>>>>>>>>>>>>>>>
    @GetMapping("/{ono}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable("ono") Long ono) {
        ReviewDTO reviewDTO = reviewService.getReviewByOno(ono);
        return ResponseEntity.ok(reviewDTO);
    }
    @PutMapping("/{ono}")
    public ResponseEntity<Void> updateReview(@PathVariable("ono") Long ono, @RequestBody ReviewDTO reviewDTO) {
        log.info("리뷰 조회 요청: ono=" + ono);
        reviewService.updateReview(ono, reviewDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/seller/{mno}")
    public ResponseEntity<Page<SellerReviewReadDTO>> getReviewsBySeller(
    @PathVariable Long mno,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "5") int size
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("regdate").descending());
    return ResponseEntity.ok(reviewService.getReviewsBySeller(mno, pageable));
}

}
