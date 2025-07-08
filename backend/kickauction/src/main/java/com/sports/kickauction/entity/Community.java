package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "POST")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@BatchSize(size = 20) //쿼리 사이즈를 줄여서 n + 1 문제를 해결
public class Community {
    /** 글ID (pno) */
    @Id
    @Column(name = "pno")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;

    /** 회원번호 (mno) */
    
    // @ManyToOne
    // @JoinColumn(name = "mno")
    // private Member member;

    @Column(name = "mno", nullable = false)
    private Long mno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mno", insertable = false, updatable = false)
    private Member member;

    /** 제목 (ptitle) */
    @Column(name = "ptitle", nullable = false, length = 255)
    private String ptitle;

    /** 내용 (pcontent) */
    @Column(name = "pcontent", columnDefinition = "TEXT")
    private String pcontent;

    /** 작성일 (pregdate) */
    @CreationTimestamp
    @Column(name = "pregdate", nullable = false, updatable = false)
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

    // n + 1 문제 해결을 위해
    @Formula("(SELECT COUNT(*) FROM COMMENT cm WHERE cm.pno = pno)")
    private Long commentCount;
}
