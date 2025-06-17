package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "seller")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class Seller {

    @Id
    private Long mno;

    @OneToOne
    @MapsId
    @JoinColumn(name = "mno")
    private Member member;

    @OneToOne(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SellerIntro sellerIntro;

    private String sname;
    private String slocation;
}
