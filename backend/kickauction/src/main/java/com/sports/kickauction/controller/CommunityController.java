package com.sports.kickauction.controller;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.CommentDTO;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.service.CommentService;
import com.sports.kickauction.service.CommunityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService service;
    private final CommentService commentService;

    // 1) 단일 게시글 조회: pno(PathVariable)로 요청받아 이전글/다음글 포함하여 반환
    @GetMapping("/{pno}")
    public ResponseEntity<CommunityDTO> getOne(@PathVariable Long pno) {
        CommunityDTO dto = service.get(pno);
        // 2) 이전글 정보
        CommunityDTO prev = service.getPrevious(pno);
        if (prev != null) {
            dto.setPrevPno(prev.getPno());
            dto.setPrevTitle(prev.getPtitle());
        }
        // 3) 다음글 정보
        CommunityDTO next = service.getNext(pno);
        if (next != null) {
            dto.setNextPno(next.getPno());
            dto.setNextTitle(next.getPtitle());
        }
        return ResponseEntity.ok(dto);
    }

    // 2) 게시글 목록 조회: 페이징, 검색 파라미터 처리 후 서비스 호출
    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<CommunityDTO>> list(PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(service.list(pageRequestDTO), HttpStatus.OK);
    }

    // 3) 게시글 등록
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> register(
            @ModelAttribute CommunityDTO communityDTO,
            @RequestParam(required = false) MultipartFile pimageFile) {
        CommunityDTO saved = service.register(communityDTO, pimageFile);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("PNO", saved.getPno()));
    }

    // 4) 게시글 수정
    @PutMapping(value = "/{pno}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> modify(
            @PathVariable Long pno,
            @ModelAttribute CommunityDTO communityDTO,
            @RequestParam(required = false) MultipartFile pimageFile) {
        communityDTO.setPno(pno);
        log.info("Modify (multipart): {}", communityDTO);
        service.modify(communityDTO, pimageFile);
        return ResponseEntity.ok(Map.of("RESULT", "SUCCESS"));
    }

    // 5) 게시글 삭제
    @DeleteMapping("/{pno}")
    @PreAuthorize("isAuthenticated()")
    public Map<String, String> remove(@PathVariable(name = "pno") Long pno) {
        log.info("Remove:  " + pno);
        service.remove(pno);
        return Map.of("RESULT", "SUCCESS");
    }

    // 6) 댓글 목록 조회
    @GetMapping("/{pno}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long pno) {
        try {
            var list = commentService.getComments(pno);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            log.error("댓글 로드 예외", e);
            Map<String, String> err = Map.of(
                    "message", e.getMessage(),
                    "trace", Arrays.stream(e.getStackTrace()).map(Object::toString).collect(Collectors.joining("\n")));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // 7) 댓글 등록
    @PostMapping("/{pno}/comments")
    public ResponseEntity<CommentDTO> writeComment(
            @PathVariable Long pno,
            @RequestBody CommentDTO dto,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CommentDTO saved = commentService.writeComment(pno, dto, auth);
        return ResponseEntity.ok(saved);
    }

    // 8) 댓글 수정
    @PatchMapping("/{pno}/comments/{cno}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long pno,
            @PathVariable Long cno,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String content = body.get("content");
        return ResponseEntity.ok(commentService.updateComment(pno, cno, content, auth));
    }

    // 9) 댓글 삭제
    @DeleteMapping("/{pno}/comments/{cno}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long pno,
            @PathVariable Long cno,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        commentService.deleteComment(pno, cno, auth);
        return ResponseEntity.noContent().build();
    }

}