package com.sports.kickauction.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    
    private Long msgId;

    private Long senderId;
    private String senderName;
    private String senderProfileImg;

    private Long receiverId;
    private String receiverName;
    private String receiverProfileImg;

    private String content;
    private LocalDateTime sentAt;

    private Boolean isRead;
}
