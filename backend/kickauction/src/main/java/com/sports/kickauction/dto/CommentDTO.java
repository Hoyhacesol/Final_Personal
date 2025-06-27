package com.sports.kickauction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long cno;
    private Long pno;
    private Long mno;
    private String writerName;  // 작성자 닉네임
    private String content;
    private LocalDateTime cregdate;
}
