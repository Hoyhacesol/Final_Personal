package com.sports.kickauction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.dto.CommentDTO;
import com.sports.kickauction.entity.Comment;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.CommentRepository;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepo;
    private final MemberRepository memberRepo; // MemberRepository 추가

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getComments(Long pno) {
        return commentRepo.findByPnoOrderByCregdateDesc(pno)
                .stream()
                .map(c -> CommentDTO.builder()
                        .cno(c.getCno())
                        .pno(c.getPno())
                        .mno(c.getMno())
                        .writerName(c.getMember().getUserName())
                        .content(c.getContent())
                        .cregdate(c.getCregdate())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO writeComment(Long pno, CommentDTO dto, Authentication auth) {
        // 1) principal 타입에 따라 Member 엔티티를 얻는 로직 분기
        Member user;
        Object principal = auth.getPrincipal();

        if (principal instanceof Member) {
            user = (Member) principal;
        } else if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) principal;
            // OAuth2User 에서 식별키(예: "login", "email", "sub" 등)를 꺼내야 합니다.
            // 여기는 예시로 "email" 을 사용합니다.
            String email = oauthUser.getAttribute("email");
            user = memberRepo.findByUserId(email) // 또는 findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("OAuth2 User not linked to Member: " + email));
        } else {
            throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
        }

        // 2) Comment 객체 생성·저장
        Comment c = Comment.builder()
                .pno(pno)
                .mno(user.getMno())
                .content(dto.getContent())
                .build();
        Comment saved = commentRepo.save(c);

        // 3) DTO 리턴
        return CommentDTO.builder()
                .cno(saved.getCno())
                .pno(saved.getPno())
                .mno(saved.getMno())
                .writerName(user.getUserName())
                .content(saved.getContent())
                .cregdate(saved.getCregdate())
                .build();
    }

    @Override
    public CommentDTO updateComment(Long pno, Long cno, String content, Authentication auth) {
        Member user = resolveUser(auth);
        Comment c = commentRepo.findByCnoAndPno(cno, pno)
                .orElseThrow(() -> new RuntimeException("댓글이 없습니다: " + cno));
        if (!c.getMno().equals(user.getMno())) {
            throw new RuntimeException("권한이 없습니다");
        }
        c.setContent(content);
        Comment updated = commentRepo.save(c);
        return CommentDTO.builder()
                .cno(updated.getCno())
                .pno(updated.getPno())
                .mno(updated.getMno())
                .writerName(user.getUserName())
                .content(updated.getContent())
                .cregdate(updated.getCregdate())
                .build();
    }

    @Override
    public void deleteComment(Long pno, Long cno, Authentication auth) {
        Member user = resolveUser(auth);
        Comment c = commentRepo.findByCnoAndPno(cno, pno)
                .orElseThrow(() -> new RuntimeException("댓글이 없습니다: " + cno));
        if (!c.getMno().equals(user.getMno())) {
            throw new RuntimeException("권한이 없습니다");
        }
        commentRepo.delete(c);
    }

     private Member resolveUser(Authentication auth) {
        Object principal = auth.getPrincipal();

        // 일반 로그인한 경우
        if (principal instanceof Member) {
            return (Member) principal;
        }
        // OAuth2 로그인한 경우
        if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) principal;
            String email = oauthUser.getAttribute("email");
            return memberRepo.findByUserId(email)
                    .orElseThrow(() -> new RuntimeException("OAuth2 User not linked to Member: " + email));
        }

        throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
    }
}
