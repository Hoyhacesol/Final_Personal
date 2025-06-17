package com.sports.kickauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerReadDTO {
    private Long mno;
    private String sname;
    private String slocation;
    private String[] simage;
    private String introContent;
    private String info;
    private int hiredCount;
    private String phone;
}
