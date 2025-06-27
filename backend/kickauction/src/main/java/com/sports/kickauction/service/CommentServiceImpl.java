package com.sports.kickauction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
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
    private final MemberRepository memberRepo;

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
                    .mprofileimg(c.getMember().getProfileimg())
                    .content(c.getContent())
                    .cregdate(c.getCregdate())
                    .build())
            .collect(Collectors.toList());
    }

    @Override
    public CommentDTO writeComment(Long pno, CommentDTO dto, Authentication auth) {
        Member user = resolveUser(auth);

        // ↓ 여기서 mno를 꼭 채워 주세요!
        Comment c = Comment.builder()
                .pno(pno)
                .mno(user.getMno())            // ← 추가
                .member(user)                  // 연관관계도 설정
                .content(dto.getContent())
                .build();

        Comment saved = commentRepo.save(c);

        return CommentDTO.builder()
                .cno(saved.getCno())
                .pno(saved.getPno())
                .mno(saved.getMno())
                .writerName(user.getUserName())
                .mprofileimg(user.getProfileimg())
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
                .mprofileimg(user.getProfileimg())
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

        // 자체 로그인한 회원
        if (principal instanceof Member m) {
            return m;
        }
        // OAuth2 로그인한 회원
        if (principal instanceof DefaultOAuth2User oauth) {
            String email = oauth.getAttribute("email");
            return memberRepo.findByUserId(email)
                    .orElseThrow(() -> new RuntimeException("OAuth2 User not linked: " + email));
        }
        // 스프링 시큐리티 기본 UserDetails
        if (principal instanceof User ud) {
            String userId = ud.getUsername();
            return memberRepo.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        }

        throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
    }
}
