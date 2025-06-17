package com.sports.kickauction.entity;

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
    /** 글ID (pno) */
    @Id
    @Column(name = "pno")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;

    /** 회원번호 (mno) */
    @Column(name = "mno", nullable = false)
    private Long mno;

    /** 제목 (ptitle) */
    @Column(name = "ptitle", nullable = false, length = 255)
    private String ptitle;

    /** 내용 (pcontent) */
    @Column(name = "pcontent", columnDefinition = "TEXT")
    private String pcontent;

    /** 작성일 (pregdate) */
    @Column(name = "pregdate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime pregdate;

    /** 조회수 (view) */
    @Column(name = "view", nullable = false)
    private Integer view;

    /** 이미지 URL (pimage) */
    @Column(name = "pimage", length = 255)
    private String pimage;

    // 편의 메서드 (선택)
    public void changePtitle(String ptitle) {
        this.ptitle = ptitle;
    }
    public void changePcontent(String pcontent) {
        this.pcontent = pcontent;
    }
    public void changeViewCount(Integer view) {
        this.view = view;
    }
    public void changePimage(String pimage) {
        this.pimage = pimage;
    }
}
