package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@ToString
@Table(name = "member")

public class Member {

    // 주석: 회원고유번호, 이메일, 비밀번호, 소셜여부(0=소셜, 1=일반가입), 유저분류, 닉네임, 전화번호
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mno;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    @Builder.Default
    private int social = 0;

    @Column(nullable = false)
    @Builder.Default
    private int role = 0;

    @Column(unique = true)
    private String userName;

    @Column(length = 11, unique = true)
    private String phone;
}
