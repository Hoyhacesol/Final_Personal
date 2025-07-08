package com.sports.kickauction.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sports.kickauction.entity.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    @EntityGraph(attributePaths = {"member"})
    Page<Community> findAll(Pageable pageable);

    // 제목만 검색
    @EntityGraph(attributePaths = {"member"})
    Page<Community> findByPtitleContainingIgnoreCase(String keyword, Pageable pageable);

    // 내용만 검색
    @EntityGraph(attributePaths = {"member"})
    Page<Community> findByPcontentContainingIgnoreCase(String keyword, Pageable pageable);

    // 제목 OR 내용 검색
    @EntityGraph(attributePaths = {"member"})
    Page<Community> findByPtitleContainingIgnoreCaseOrPcontentContainingIgnoreCase(
        String t, String c, Pageable pageable);


     // pno 기준 바로 이전 글 (pno보다 작은 값 중에서 가장 큰 pno)
    Optional<Community> findTopByPnoLessThanOrderByPnoDesc(Long pno);

    // pno 기준 바로 다음 글 (pno보다 큰 값 중에서 가장 작은 pno)
    Optional<Community> findTopByPnoGreaterThanOrderByPnoAsc(Long pno);   
    
      @Query(
      value = "SELECT c FROM Community c JOIN FETCH c.member",
      countQuery = "SELECT COUNT(c) FROM Community c"
    )
    Page<Community> findAllWithMember(Pageable pageable);


      
}
