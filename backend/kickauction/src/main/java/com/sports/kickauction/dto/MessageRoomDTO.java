package com.sports.kickauction.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRoomDTO {
    private Long partnerMno;       
    private String partnerName;    
    private String partnerProfileImg; 
    private String lastMessage;     
    private LocalDateTime lastSentAt; 
    private int unreadCount;        
}