package com.sports.kickauction.service;

import java.util.List;
import com.sports.kickauction.dto.CommentDTO;
import org.springframework.security.core.Authentication;

public interface CommentService {
    // 비로그인 사용자도 호출 가능
    List<CommentDTO> getComments(Long pno);

    // 로그인 사용자만 호출
    CommentDTO writeComment(Long pno, CommentDTO dto, Authentication auth);

    CommentDTO updateComment(Long pno, Long cno, String content, Authentication auth);

    void deleteComment(Long pno, Long cno, Authentication auth);
}
