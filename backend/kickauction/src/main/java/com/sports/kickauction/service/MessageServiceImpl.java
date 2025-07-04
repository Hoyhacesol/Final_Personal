package com.sports.kickauction.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.dto.MessageRoomDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;
import com.sports.kickauction.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    public Message sendMessage(Member sender, Member receiver, String content) {
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getDialog(Member me, Member target) {
        return messageRepository.findDialog(me, target);
    }

    @Override
    public List<Message> getInbox(Member me) {
        return messageRepository.findByReceiverAndDeletedByReceiverFalseOrderBySentAtDesc(me);
    }

    @Override
    public List<Message> getOutbox(Member me) {
        return messageRepository.findBySenderAndDeletedBySenderFalseOrderBySentAtDesc(me);
    }

    @Override
    public void deleteMessage(Long msgId, Member who, boolean isSender) {
        Message message = messageRepository.findById(msgId)
                .orElseThrow(() -> new IllegalArgumentException("쪽지를 찾을 수 없습니다."));
        if (isSender && message.getSender().getMno().equals(who.getMno())) {
            message.setDeletedBySender(true);
        }
        if (!isSender && message.getReceiver().getMno().equals(who.getMno())) {
            message.setDeletedByReceiver(true);
        }
        messageRepository.save(message);
    }

    @Override
    public List<MessageRoomDTO> getAllRoomsForMember(Long myMno) {
    List<Object[]> result = messageRepository.findAllRoomsByMemberNative(myMno);
    List<MessageRoomDTO> rooms = new ArrayList<>();
    for (Object[] row : result) {
        MessageRoomDTO dto = MessageRoomDTO.builder()
            .partnerMno(((Number)row[0]).longValue())
            .partnerName((String) row[1])
            .partnerProfileImg((String) row[2])
            .lastMessage((String) row[3])
            .lastSentAt((row[4] != null) ? ((java.sql.Timestamp) row[4]).toLocalDateTime() : null)
            .unreadCount(((Number)row[5]).intValue())
            .build();
        rooms.add(dto);
    }
    return rooms;
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Member me, Member partner) {
        List<Message> unreadMessages = messageRepository.findBySenderAndReceiverAndIsReadFalse(partner, me);
        for (Message msg : unreadMessages) {
            msg.setIsRead(true);
        }
        messageRepository.saveAll(unreadMessages);
    }

    @Override
    public void sendSystemMessageForBiz(Member sender, Member receiver, String otitle, Long price) {
    String content = String.format(
        "[킥옥션 자동발송]\n%s님이 \"%s\" 건에 대해 %,d원으로 새롭게 제안했어요.",
        sender.getUserName(), otitle, price
    );
    sendMessage(sender, receiver, content);
}
}