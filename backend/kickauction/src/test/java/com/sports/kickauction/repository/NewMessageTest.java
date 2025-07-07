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
        Member member1 = memberRepository.findById(1L).orElseThrow();
        Member member2 = memberRepository.findById(2L).orElseThrow();
        Member member5 = memberRepository.findById(5L).orElseThrow();
        Member member9 = memberRepository.findById(9L).orElseThrow();
        Member member13 = memberRepository.findById(13L).orElseThrow();
        Member member14 = memberRepository.findById(14L).orElseThrow();

        List<Message> messages = List.of(
            createMessage(member5, member1, "오늘 중미용병 고생하셨습니다!",true, LocalDateTime.of(2025, 6, 28, 17, 40, 22)),
            createMessage(member1, member5, "ㅎㅎㅎ 아뇨 제가 끼워주셔서 감사하죠",true, LocalDateTime.of(2025, 6, 28, 17, 42, 35)),
            createMessage(member5, member1, "ㅋㅋ 다음에 시간 되시면 또 합시다",true, LocalDateTime.of(2025, 6, 28, 17, 44, 50)),
            createMessage(member1, member14, "사장님 판타지스타 이번주 토요일날 쉬나요??",true, LocalDateTime.of(2025, 6, 29, 13, 00, 35)),
            createMessage(member14, member1, "네 가족여행이라ㅠ",true, LocalDateTime.of(2025, 6, 29, 13, 31, 11)),
            createMessage(member1, member2, "몰라 토욜날 선우데리고 7시 ㄱㄱ",true, LocalDateTime.of(2025, 7, 1, 9, 43, 22)),
            createMessage(member2, member1, "조축아저씨들 ㅈㄴ잘하는디",true, LocalDateTime.of(2025, 7, 1, 9, 43, 45)),
            createMessage(member1, member2, "배고파",true, LocalDateTime.of(2025, 7, 1, 9, 45, 30)),
            createMessage(member2, member1, "ㄹㅇ", false,LocalDateTime.of(2025, 7, 1, 9, 49, 30)),
            createMessage(member2, member1, "ㅋㅋㅋㅋ", false,LocalDateTime.of(2025, 7, 1, 9, 49, 34)),
            createMessage(member13, member1, "[킥옥션 자동발송]\n래버리지20배율님이 \"7월 4일 4/4 실내풋살\"건에 대해 42,000원으로 새롭게 제안했어요.", false,LocalDateTime.of(2025, 7, 1, 12, 20, 18)),
            createMessage(member9, member1, "님아", false,LocalDateTime.of(2025, 7, 1, 14, 51, 34))
            
        );

        messageRepository.saveAll(messages);
    }

    private Message createMessage(Member sender, Member receiver,String content, boolean isRead, LocalDateTime sentAt) {
        return Message.builder()
            .sender(sender)
            .receiver(receiver)
            .content(content)
            .isRead(isRead)
            .deletedBySender(false)
            .deletedByReceiver(false)
            .sentAt(sentAt)
            .build();
    }
}