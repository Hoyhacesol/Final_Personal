package com.sports.kickauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerRegisterReadDTO {
    private String sname;      
    private String phone;      
    private String slocation;  
}
