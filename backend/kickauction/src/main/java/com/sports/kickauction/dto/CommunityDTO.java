package com.sports.kickauction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityDTO {
    /** 글ID */
    private Long id;

    /** 회원번호 */
    private Long memberId;

    /** 제목 */
    private String title;

    /** 내용 */
    private String content;

    /** 작성일 */
    private LocalDateTime createdDate;

    /** 조회수 */
    private Integer viewCount;

    /** 이미지 URL */
    private String imageUrl;
}
