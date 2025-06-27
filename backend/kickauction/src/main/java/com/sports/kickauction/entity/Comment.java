// src/main/java/com/sports/kickauction/entity/Comment.java
package com.sports.kickauction.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "member")
public class Comment {

    @Id
    @Column(name = "cno")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno;

    @Column(name = "pno", nullable = false)
    private Long pno;

    @Column(name = "mno", nullable = false)
    private Long mno;

    // Community 클래스처럼 member 연관관계 추가
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mno", insertable = false, updatable = false)
    private Member member;

     @Column(name = "ccontent", columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "cregdate", nullable = false, updatable = false)
    private LocalDateTime cregdate;
}
