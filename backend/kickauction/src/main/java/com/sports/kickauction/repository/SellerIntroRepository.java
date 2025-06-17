package com.sports.kickauction.repository;

import com.sports.kickauction.entity.SellerIntro;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerIntroRepository extends JpaRepository<SellerIntro, Long> {
  @EntityGraph(attributePaths = {"seller", "seller.member"}) //  member까지 로딩
    List<SellerIntro> findAll();
}