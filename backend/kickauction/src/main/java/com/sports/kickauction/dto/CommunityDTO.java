package com.sports.kickauction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityDTO {
    /** 글ID (pno) */
    private Long pno;

    /** 회원번호 (mno) */
    private Long mno;

    /** 회원 닉네임 (user_name) */
    private String writerName;

    /** 제목 (ptitle) */
    private String ptitle;

    /** 내용 (pcontent) */
    private String pcontent;

    /** 작성일 (pregdate) */
    private LocalDateTime pregdate;

    /** 조회수 (view) */
    private Integer view;

    /** 이미지 URL (pimage) */
    private String pimage;
}
