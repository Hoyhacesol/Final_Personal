package com.sports.kickauction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.kickauction.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 게시글(pno)의 댓글을 최신순으로 조회
    List<Comment> findByPnoOrderByCregdateDesc(Long pno);

    Optional<Comment> findByCnoAndPno(Long cno, Long pno);
}
