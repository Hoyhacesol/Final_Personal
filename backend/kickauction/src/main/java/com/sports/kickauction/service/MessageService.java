package com.sports.kickauction.service;

import java.util.List;

import com.sports.kickauction.dto.MessageRoomDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;

public interface MessageService {

   // 메시지 전송
    Message sendMessage(Member sender, Member receiver, String content);

    // 1:1 대화 내역 (나-상대방)
    List<Message> getDialog(Member me, Member target);

    // 내가 받은 쪽지함
    List<Message> getInbox(Member me);

    // 내가 보낸 쪽지함
    List<Message> getOutbox(Member me);

    // 메시지 삭제 (soft delete)
    void deleteMessage(Long msgId, Member who, boolean isSender);
    
    public List<MessageRoomDTO> getAllRoomsForMember(Long myMno);

    void markMessagesAsRead(Member me, Member partner);
}
