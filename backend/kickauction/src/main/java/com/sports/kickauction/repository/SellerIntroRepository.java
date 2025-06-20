package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerIntroRepository extends JpaRepository<SellerIntro, Long> {
  boolean existsBySeller(Seller seller);
}