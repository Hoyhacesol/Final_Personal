package com.sports.kickauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerModifyReadDTO {
    private List<String> simage;
    private String introContent;
    private String info;
    private String sname;
    private String phone;
    private String slocation;
}
