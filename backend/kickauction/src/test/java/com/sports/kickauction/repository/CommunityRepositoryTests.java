package com.sports.kickauction.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import lombok.extern.log4j.Log4j2;

import java.util.stream.IntStream;

import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.entity.Community;
import com.sports.kickauction.service.CommunityService;

@SpringBootTest
@Log4j2
public class CommunityRepositoryTests {
    @Autowired
    private CommunityRepository communityRepository;
    @Autowired
    private CommunityService communityService;

    @Test
    public void test1() {
        log.info("--------------------------");
        log.info(communityRepository);
    }

    @Test
    public void testInsert() {
        // 1번부터 100번까지 루프
        IntStream.rangeClosed(1, 100).forEach(i -> {
            Community community = Community.builder()
                    .mno((long) (i % 10 + 1)) // 예시로 1~10 회원 돌아가며 설정
                    .ptitle("Title..." + i)
                    .pcontent("Content..." + i)
                    .view(0)
                    .pimage(null)
                    .build();
            communityRepository.save(community);
        });
    }

    @Test
    void testRead() {
        // 존재하는 번호로 확인
        Long pno = 33L;
        java.util.Optional<Community> result = communityRepository.findById(pno);
        Community community = result.orElseThrow();
        log.info(community);
    }

    @Test
    void testModify() {
        Community community = communityRepository.findById(30L)
                .orElseThrow(() -> new IllegalArgumentException("pno 30번이 존재하지 않습니다."));

        // 원하는 값으로 수정
        community.changePtitle("수정된 제목 30");
        community.changePcontent("수정된 내용 30");
        community.changeViewCount(999);
        community.changePimage("modified30.png");

        // 수정 반영
        communityRepository.save(community);

    }

    @Test
    void testDelete() {
        Long pno = 1L;
        communityRepository.deleteById(pno);
    }

   @Test
    public void testRegister() {
        CommunityDTO communityDTO = CommunityDTO.builder()
                .mno(1L)
                .ptitle("서비스 테스트")
                .pcontent("테스트 내용")
                .view(0)
                .pimage(null)
                .build();
        // MultipartFile이 없는 경우 null을 넘겨줍니다.
        CommunityDTO savedDto = communityService.register(communityDTO, null);
        log.info("생성된 게시글 번호: {}", savedDto.getPno());
    }

    @Test
    public void testGet() {
        Long pno = 101L;
        CommunityDTO communityDTO = communityService.get(pno);
        log.info(communityDTO);
    }

    @Test
    public void testList() {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(2)
                .size(10)
                .build();
        PageResponseDTO<CommunityDTO> response = communityService.list(pageRequestDTO);
        log.info(response);
    }

}