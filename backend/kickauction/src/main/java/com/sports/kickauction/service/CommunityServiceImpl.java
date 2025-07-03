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

import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.entity.Community;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.repository.CommentRepository;
import com.sports.kickauction.repository.CommunityRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.util.Optional;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    @Value("${upload.path}")
    private String uploadDir;

    private final ModelMapper modelMapper;
    private final CommunityRepository communityRepository;
    private final CommentRepository commentRepository;

    @PostConstruct
    public void initModelMapper() {
        modelMapper.typeMap(CommunityDTO.class, Community.class)
                .addMappings(mapper -> mapper.skip(Community::setPregdate));
    }

    @Override
    public CommunityDTO register(CommunityDTO dto, MultipartFile pimageFile) {
        // 1) DEBUG: uploadDir 주입 값 확인
        System.out.println("[DEBUG] uploadDir = " + uploadDir);

        // 2) 이미지 저장
        if (pimageFile != null && !pimageFile.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String filename = UUID.randomUUID() + "_" + pimageFile.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                pimageFile.transferTo(filePath.toFile());

                dto.setPimage("/images/" + filename);
            } catch (IOException e) {
                e.printStackTrace(); // 스택트레이스 찍어보고
                throw new RuntimeException("이미지 저장 실패: " + e.getMessage(), e);
            }
        }

        // 3) 저장 & 반환
        Community entity = modelMapper.map(dto, Community.class);
        if (entity.getView() == null) {
            entity.setView(0);
        }
        Community saved = communityRepository.save(entity);
        return modelMapper.map(saved, CommunityDTO.class);
    }

    // 게시글 조회
    @Override
    @Transactional
    public CommunityDTO get(Long pno) {
        Community entity = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 글이 없습니다."));
        return modelMapper.map(entity, CommunityDTO.class);
        // log.info("ID로 조회 (조회수 증가): {}", pno);
        // // 1) 엔티티 조회
        // Community entity = communityRepository.findById(pno)
        // .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 없습니다."));
        // // 2) 조회수 1 증가
        // Integer current = entity.getView() != null ? entity.getView() : 0;
        // entity.setView(current + 1);
        // Community updated = communityRepository.saveAndFlush(entity);
        // // 3) DTO 변환
        // return modelMapper.map(updated, CommunityDTO.class);
    }

    @Override
    public void incrementViewCount(Long pno) {
        communityRepository.findById(pno).ifPresent(entity -> {
            entity.setView((entity.getView() == null ? 0 : entity.getView()) + 1);
            communityRepository.saveAndFlush(entity);
        });
    }

    // 게시글 수정
    @Override
    public void modify(CommunityDTO communityDTO, MultipartFile pimageFile) {
        log.info("수정 요청 DTO: {}", communityDTO);
        Long pno = communityDTO.getPno();

        // 1) 기존 엔티티 조회
        Community community = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 없습니다."));

        // 2) 새 파일 업로드 전에, 이전 파일이 있으면 삭제
        String oldImage = community.getPimage(); // 예: "/images/uuid_oldname.jpg"
        if (pimageFile != null && !pimageFile.isEmpty()) {
            if (oldImage != null && !oldImage.isBlank()) {
                try {
                    // 웹에 노출되는 경로(/images/...)에서 파일명만 추출
                    String oldFilename = Paths.get(oldImage).getFileName().toString();
                    Path oldFilePath = Paths.get(uploadDir, oldFilename);
                    Files.deleteIfExists(oldFilePath);
                    log.info("이전 이미지 삭제: {}", oldFilePath);
                } catch (IOException e) {
                    log.warn("이전 이미지 삭제 실패: {}", e.getMessage());
                }
            }

            // 3) 새 이미지 저장
            try {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String filename = UUID.randomUUID() + "_" + pimageFile.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                pimageFile.transferTo(filePath.toFile());

                // 엔티티에 새 경로 반영
                community.changePimage("/images/" + filename);
            } catch (IOException e) {
                log.error("새 이미지 저장 실패", e);
                throw new RuntimeException("이미지 저장 실패: " + e.getMessage(), e);
            }
        }

        // 4) 나머지 필드 변경
        community.changePtitle(communityDTO.getPtitle());
        community.changePcontent(communityDTO.getPcontent());
        if (communityDTO.getView() != null) {
            community.setView(communityDTO.getView());
        }

        // 5) 저장
        communityRepository.save(community);
    }

    // 게시글 삭제
    @Override
    public void remove(Long pno) {
        log.info("삭제 요청 ID: {}", pno);

        // 1) 먼저 엔티티를 조회해서 이미지 경로를 꺼냅니다.
        Community community = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 없습니다."));

        String imagePath = community.getPimage(); // e.g. "/images/uuid_filename.jpg"
        if (imagePath != null && !imagePath.isBlank()) {
            try {
                // web 경로(/images/xxx)에서 파일명만 추출
                String filename = Paths.get(imagePath).getFileName().toString();
                Path fileOnDisk = Paths.get(uploadDir, filename);

                // 파일이 존재하면 삭제
                Files.deleteIfExists(fileOnDisk);
                log.info("첨부 이미지 삭제: {}", fileOnDisk);
            } catch (IOException e) {
                log.warn("첨부 이미지 삭제 실패: {}", e.getMessage());
            }
        }

        // 2) 그다음 DB 레코드를 삭제합니다.
        communityRepository.deleteById(pno);
    }

    // 게시글 목록 조회 (페이징)
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("목록 요청: {}", pageRequestDTO);

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        Page<Community> result;
        String type = pageRequestDTO.getType();
        String keyword = pageRequestDTO.getKeyword();

        if (keyword != null && !keyword.isBlank()) {
            switch (type) {
                case "t": // 제목 검색
                    result = communityRepository
                            .findByPtitleContainingIgnoreCase(keyword, pageable);
                    break;
                case "c": // 내용 검색
                    result = communityRepository
                            .findByPcontentContainingIgnoreCase(keyword, pageable);
                    break;
                case "tc": // 제목+내용 검색
                default:
                    result = communityRepository
                            .findByPtitleContainingIgnoreCaseOrPcontentContainingIgnoreCase(
                                    keyword, keyword, pageable);
                    break;
            }
        } else {
            // 검색어가 없으면 전체 목록
            result = communityRepository.findAll(pageable);
        }

        List<CommunityDTO> dtoList = result.getContent().stream()
                .map(entity -> {
                    CommunityDTO cd = modelMapper.map(entity, CommunityDTO.class);
                    // entity.member 는 @ManyToOne 으로 가져온 Member 엔티티
                    if (entity.getMember() != null) {
                        cd.setWriterName(entity.getMember().getUserName());
                    }

                    long cnt = commentRepository.countByPno(entity.getPno());
                    cd.setCommentCount(cnt);

                    return cd;
                })
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<CommunityDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommunityDTO getPrevious(Long pno) {
        Optional<Community> prev = communityRepository
                .findTopByPnoLessThanOrderByPnoDesc(pno);
        return prev.map(this::entityToDto).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public CommunityDTO getNext(Long pno) {
        Optional<Community> next = communityRepository
                .findTopByPnoGreaterThanOrderByPnoAsc(pno);
        return next.map(this::entityToDto).orElse(null);
    }

    private CommunityDTO entityToDto(Community e) {
        return CommunityDTO.builder()
                .pno(e.getPno())
                .mno(e.getMno())
                .writerName(e.getMember().getUserName())
                .mprofileimg(e.getMember().getProfileimg())
                .ptitle(e.getPtitle())
                .pcontent(e.getPcontent())
                .pregdate(e.getPregdate())
                .view(e.getView())
                .pimage(e.getPimage())
                // prev/next 필드는 컨트롤러에서 채워줍니다.
                .build();
    }

}
