package com.sports.kickauction.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "review")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id
    // PK가 order 번호(ono)와 1:1이라면 그대로 사용하고,
    // 자동 생성이 필요하면 @GeneratedValue 전략 추가하세요.
    @Column(name = "ono")
    private Long ono;

    @Column(name = "mno", nullable = false)
    private Long mno;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "rcontent", columnDefinition="VARCHAR2(4000)")
    private String rcontent;

    @Column(name = "rregdate", insertable = false, updatable = false)
    private LocalDateTime rregdate;
}
