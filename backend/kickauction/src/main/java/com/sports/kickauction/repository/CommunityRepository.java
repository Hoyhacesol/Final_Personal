package com.sports.kickauction.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    // 제목만 검색
    Page<Community> findByPtitleContainingIgnoreCase(String keyword, Pageable pageable);

    // 내용만 검색
    Page<Community> findByPcontentContainingIgnoreCase(String keyword, Pageable pageable);

    // 제목 OR 내용 검색
    Page<Community> findByPtitleContainingIgnoreCaseOrPcontentContainingIgnoreCase(
            String titleKeyword, String contentKeyword, Pageable pageable);
}
