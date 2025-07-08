package com.sports.kickauction.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BizModifyDTO {
    private int ono;              // 견적 ID
    private Long price;           // 제안 가격
    private String bcontent;      // 상세 설명
    private String banswer;       // 요청에 대한 답변
}
