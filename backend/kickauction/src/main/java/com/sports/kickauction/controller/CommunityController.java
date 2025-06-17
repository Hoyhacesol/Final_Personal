package com.sports.kickauction.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.service.CommunityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService service;

    @GetMapping("/{pno}")
    public ResponseEntity<CommunityDTO> getOne(@PathVariable Long pno) {
        CommunityDTO dto = service.get(pno);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/list")
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return service.list(pageRequestDTO);
    }

    // @PostMapping("/")
    // public Map<String, Long> register(@RequestBody CommunityDTO communityDTO) {
    // log.info("CommunityDTO: " + communityDTO);
    // Long pno = service.register(communityDTO);
    // return Map.of("PNO", pno);
    // }

    @PostMapping(value = "", // or "/" 동일하게 동작함
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Long>> register(
            @ModelAttribute CommunityDTO communityDTO,
            @RequestParam(value = "pimageFile", required = false) MultipartFile pimageFile) {
        // service.register는 CommunityDTO와 MultipartFile을 받아서 저장 후 DTO 리턴
        CommunityDTO saved = service.register(communityDTO, pimageFile);
        // 저장된 pno를 리턴
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("PNO", saved.getPno()));
    }

    @PutMapping("/{pno}")
    public Map<String, String> modify(
            @PathVariable(name = "pno") Long pno,
            @RequestBody CommunityDTO communityDTO) {
        communityDTO.setPno(pno);
        log.info("Modify: " + communityDTO);
        service.modify(communityDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{pno}")
    public Map<String, String> remove(@PathVariable(name = "pno") Long pno) {
        log.info("Remove:  " + pno);
        service.remove(pno);
        return Map.of("RESULT", "SUCCESS");
    }

}