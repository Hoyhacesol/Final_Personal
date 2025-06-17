package com.sports.kickauction.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberSellerDTO {
    private String userId;
    private String userPw;
    private String userName;
    private String phone;
    private String sname;
    private String slocation;
}
