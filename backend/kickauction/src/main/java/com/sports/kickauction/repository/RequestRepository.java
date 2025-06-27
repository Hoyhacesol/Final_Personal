package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    
    @Query("SELECT r FROM Request r " +
       "WHERE (:city IS NULL OR r.olocation LIKE CONCAT(:city, '%')) " +
       "AND (:district IS NULL OR r.olocation LIKE CONCAT('%', :district, '%')) " +
       "AND (:playType IS NULL OR r.playType = :playType)")
    Page<Request> findFilteredRequests(@Param("city") String city,@Param("district") String district,@Param("playType") String playType,Pageable pageable);

 List<Request> findByMno(int mno); // getMyOrdersByMemberNo에서 사용 메서드
    List<Request> findByFinishedAndOregdateBefore(int finished, LocalDateTime before); //삭제 기한 지난 견적 조회

}