package com.sports.kickauction.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.service.CommunityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/todo")
public class CommunityController {
    private final CommunityService service;

    @GetMapping("/{pno}")
    public CommunityDTO get(@PathVariable(name = "pno") Long pno) {
        return service.get(pno);
    }

    @GetMapping("/list")
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return service.list(pageRequestDTO);
    }

    @PostMapping("/")
    public Map<String, Long> register(@RequestBody CommunityDTO communityDTO) {
        log.info("CommunityDTO: " + communityDTO);
        Long pno = service.register(communityDTO);
        return Map.of("PNO", pno);
    }

    @PutMapping("/{pno}")
    public Map<String, String> modify(
            @PathVariable(name = "pno") Long pno,
            @RequestBody CommunityDTO communityDTO) {
        communityDTO.setId(pno);
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