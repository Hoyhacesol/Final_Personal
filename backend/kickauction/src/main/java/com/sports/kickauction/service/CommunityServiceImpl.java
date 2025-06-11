package com.sports.kickauction.service;

import java.util.stream.Collectors;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sports.kickauction.community.Community;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    // 자동주입 대상은 final로
    private final ModelMapper modelMapper;
    private final CommunityRepository communityRepository;

    // 게시글 등록
    @Override
    public Long register(CommunityDTO communityDTO) {
        log.info("CommunityDTO to Entity mapping: {}", communityDTO);

        // viewCount, imageUrl 기본값 처리 (DTO에 값이 없으면 기본값 설정)
        if (communityDTO.getViewCount() == null) {
            communityDTO.setViewCount(0);
        }
        if (communityDTO.getImageUrl() == null) {
            communityDTO.setImageUrl("");
        }

        Community community = modelMapper.map(communityDTO, Community.class);
        Community saved = communityRepository.save(community);

        return saved.getId();
    }

    // 게시글 조회
    @Override
    @Transactional(readOnly = true)
    public CommunityDTO get(Long pno) {
        log.info("Fetching community with id: {}", pno);
        Community community = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 존재하지 않습니다."));
        CommunityDTO dto = modelMapper.map(community, CommunityDTO.class);
        return dto;
    }

    // 게시글 수정
    @Override
    public void modify(CommunityDTO communityDTO) {
        log.info("Modifying community: {}", communityDTO);

        Community community = communityRepository.findById(communityDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException(communityDTO.getId() + "번 게시글이 존재하지 않습니다."));

        // 변경 가능한 필드 업데이트
        community.changeTitle(communityDTO.getTitle());
        community.changeContent(communityDTO.getContent());
        if (communityDTO.getViewCount() != null) {
            community.changeViewCount(communityDTO.getViewCount());
        }
        if (communityDTO.getImageUrl() != null) {
            community.changeImageUrl(communityDTO.getImageUrl());
        }

        communityRepository.save(community);
    }

    // 게시글 삭제
    @Override
    public void remove(Long pno) {
        log.info("Removing community with id: {}", pno);
        communityRepository.deleteById(pno);
    }

    // 게시글 목록 조회 (페이징)
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("Listing communities: {}", pageRequestDTO);

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("id").descending());

        Page<Community> result = communityRepository.findAll(pageable);

        List<CommunityDTO> dtoList = result.getContent().stream()
                .map(community -> modelMapper.map(community, CommunityDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<CommunityDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

}
