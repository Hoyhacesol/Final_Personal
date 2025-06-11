package com.sports.kickauction.community;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "POST")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Community {
    /** 글ID (자동 증가) */
    @Id
    @Column(name = "pno")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 회원번호 (외래키) */
    @Column(name = "mno", nullable = false)
    private Long memberId;

    /** 제목 */
    @Column(name = "ptitle", nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'title'")
    private String title;

    /** 내용 */
    @Column(name = "pcontent", columnDefinition = "TEXT")
    private String content;

    /** 작성일 */
    @Column(name = "pregdate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate;

    /** 조회수 */
    @Column(name = "view", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer viewCount;

    /** 이미지 URL */
    @Column(name = "pimage", length = 255)
    private String imageUrl;

    public void changeTitle(String title) {
        this.title = title;
    }

    public void changeContent(String content) {
        this.content = content;
    }

    public void changeCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void changeViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public void changeImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
