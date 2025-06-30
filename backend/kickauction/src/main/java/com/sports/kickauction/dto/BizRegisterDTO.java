package com.sports.kickauction.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BizRegisterDTO {
    private int ono;          // 견적 요청 ID
    private int price;         // 제안 가격
    private String bcontent;   // 상세 정보
    private String banswer;    // 요청 답변
}