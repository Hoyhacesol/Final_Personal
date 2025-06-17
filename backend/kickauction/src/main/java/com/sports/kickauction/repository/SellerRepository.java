package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Seller;



public interface SellerRepository extends JpaRepository<Seller, Long>{
  
}
