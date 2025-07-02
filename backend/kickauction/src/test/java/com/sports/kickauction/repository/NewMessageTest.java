package com.sports.kickauction.repository;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;

@SpringBootTest
@Transactional
@Rollback(false) 
public class NewMessageTest {

     @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Test
    public void insertDummyMessages() {
        Member sender2 = memberRepository.findById(2L).orElseThrow();
        Member sender5 = memberRepository.findById(5L).orElseThrow();
        Member sender13 = memberRepository.findById(13L).orElseThrow();
        Member sender9 = memberRepository.findById(9L).orElseThrow();
        Member receiver14 = memberRepository.findById(14L).orElseThrow();

        List<Message> messages = List.of(
            createMessage(sender2, receiver14, "ㄹㅇ", LocalDateTime.of(2025, 7, 1, 9, 49, 30)),
            createMessage(sender2, receiver14, "ㅋㅋㅋㅋ", LocalDateTime.of(2025, 7, 1, 9, 49, 34)),
            createMessage(sender5, receiver14, "[킥옥션 자동발송]\n<의뢰자닉네임>님이 <제안자닉네임>님의 제안을 선택했어요.", LocalDateTime.of(2025, 7, 1, 14, 35, 36)),
            createMessage(sender13, receiver14, "님아", LocalDateTime.of(2025, 7, 1, 14, 51, 34)),
            createMessage(sender9, receiver14, "[킥옥션 자동발송]\n<제안자닉네임>님이 <order>건에 대해 <가격>으로 새롭게 제안했어요.", LocalDateTime.of(2025, 7, 2, 8, 16, 55))
        );

        messageRepository.saveAll(messages);
    }

    private Message createMessage(Member sender, Member receiver, String content, LocalDateTime sentAt) {
        return Message.builder()
            .sender(sender)
            .receiver(receiver)
            .content(content)
            .isRead(false)
            .deletedBySender(false)
            .deletedByReceiver(false)
            .sentAt(sentAt)
            .build();
    }
}