package com.sports.kickauction.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Builder
@AllArgsConstructor
@Getter @Setter
@ToString(exclude = {"sender", "receiver"})
@NoArgsConstructor
@Table(name = "message")

public class Message {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long msgId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Member sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private Member receiver;

    @Column(nullable = false, length = 1000)
    private String content;
 
    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deletedBySender = false;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deletedByReceiver = false;
  
    @PrePersist
    protected void onCreate() {
        if (sentAt == null) sentAt = LocalDateTime.now();
    }
}
