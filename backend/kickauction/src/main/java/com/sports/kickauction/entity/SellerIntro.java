package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "seller_intro")
@EqualsAndHashCode(callSuper = false)
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class SellerIntro extends BaseEntity{

    @Id
    private Long mno;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "mno")
    private Seller seller;

    private String introContent;
    
    @Column(length = 1000)
    private String simage;
    private Integer hiredCount;
    private String info;
}
