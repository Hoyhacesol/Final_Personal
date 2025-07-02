package com.sports.kickauction.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.dto.MessageDTO;
import com.sports.kickauction.dto.MessageRoomDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.MessageRepository;
import com.sports.kickauction.service.MemberDetails;
import com.sports.kickauction.service.MemberService;
import com.sports.kickauction.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;


    // 쪽지 보내기
    @PostMapping
    public ResponseEntity<?> sendMessage(
            Principal principal,
            @RequestParam Long receiverId,
            @RequestParam String content
    ) {
        Member sender = memberService.findByUserId(principal.getName());
        Member receiver = memberService.findById(receiverId);
        if (receiver == null) {
            return ResponseEntity.badRequest().body("수신자를 찾을 수 없습니다.");
        }
        Message saved = messageService.sendMessage(sender, receiver, content);
        return ResponseEntity.ok(saved);
    }

    // 1:1 대화내역 조회 (나-상대방)
    @GetMapping("/dialog")
    public ResponseEntity<?> getDialog(
            Principal principal,
            @RequestParam Long target // 상대 mno
    ) {
        Member me = memberService.findByUserId(principal.getName());
        Member targetUser = memberService.findById(target);
        if (targetUser == null) {
            return ResponseEntity.badRequest().body("상대방을 찾을 수 없습니다.");
        }

         // 주석: 안 읽은 메시지 읽음 처리
         messageRepository.markMessagesAsRead(me, targetUser);

        List<Message> dialog = messageService.getDialog(me, targetUser);
        // 주석: entity->DTO Trans
        List<MessageDTO> dtoList = dialog.stream()
            .map(msg -> {
                MessageDTO dto = new MessageDTO();
                dto.setMsgId(msg.getMsgId());
                dto.setContent(msg.getContent());
                dto.setSentAt(msg.getSentAt());
                dto.setSenderId(msg.getSender().getMno());
                dto.setReceiverId(msg.getReceiver().getMno());
                dto.setIsRead(msg.getIsRead());
                
                return dto;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    // 채팅방 열면 채팅기록 불러오기
    @GetMapping("/rooms")
    public ResponseEntity<?> getMyMessageRooms(Principal principal) {
        Member me = memberService.findByUserId(principal.getName());
        List<MessageRoomDTO> rooms = messageService.getAllRoomsForMember(me.getMno());
        return ResponseEntity.ok(rooms);
    }

    // 닉네임 검색 후 채팅시작
    @GetMapping("/find-user")
    public ResponseEntity<?> findUserByNickname(@RequestParam String nickname, Authentication authentication) {
        System.out.println("🔍 nickname 검색 요청: " + nickname);

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oAuth2User) {
            email = (String) oAuth2User.getAttribute("email");

            if (email == null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
                if (kakaoAccount != null) {
                    email = (String) kakaoAccount.get("email");
                }
            }
        }

        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 정보 없음");
        }

        Member me = memberRepository.findByUserId(email)
            .orElse(null);

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증된 사용자 정보를 찾을 수 없습니다.");
        }

        // 닉네임으로 대상 사용자 찾기
        Optional<Member> foundOpt = memberRepository.findByUserName(nickname);
        if (foundOpt.isEmpty() || foundOpt.get().getMno().equals(me.getMno())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("대상을 찾을 수 없습니다.");
        }

        Member target = foundOpt.get();

        return ResponseEntity.ok(Map.of(
            "mno", target.getMno(),
            "user_name", target.getUserName(),
            "profileimg", target.getProfileimg()
        ));
    }

    //주석: 읽음처리
    @PutMapping("/mark-read")
    public ResponseEntity<?> markMessagesAsRead(
        Principal principal,
        @RequestParam Long partnerId
    ) {
        Member me = memberService.findByUserId(principal.getName());
        Member partner = memberService.findById(partnerId);
        if (partner == null) return ResponseEntity.badRequest().body("상대방 없음");

        messageService.markMessagesAsRead(me, partner);
        return ResponseEntity.ok().build();
    }

    // 주석: 읽지 않은 메세지 총 개수
    @GetMapping("/unread/total")
    public ResponseEntity<Long> getTotalUnreadCount(Principal principal) {
        Member me = memberService.findByUserId(principal.getName());
        long count = messageRepository.countUnreadByReceiver(me);
        return ResponseEntity.ok(count);
    }

}