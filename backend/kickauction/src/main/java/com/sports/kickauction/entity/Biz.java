package com.sports.kickauction.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "biz",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"mno", "ono"})
    }
)
@Getter
@Setter
@ToString(exclude = {"seller", "request"}) // 순환참조 방지
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class Biz extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bno;

  @ManyToOne
  @JoinColumn(name = "mno", nullable = false)
  private  Seller seller;

  @ManyToOne
  @JoinColumn(name = "ono", nullable = false)
  private Request request;

  private Long price;

  private String bcontent;

  private String banswer;
}

