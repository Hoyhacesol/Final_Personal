package com.sports.kickauction.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sports.kickauction.entity.Request;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    
    @Query("SELECT r FROM Request r " +
       "WHERE r.finished = 0 " +
       "AND (:city IS NULL OR r.olocation LIKE CONCAT(:city, '%')) " +
       "AND (:district IS NULL OR r.olocation LIKE CONCAT('%', :district, '%')) " +
       "AND (:playType IS NULL OR r.playType = :playType)")
    Page<Request> findFilteredRequests(@Param("city") String city,
                                   @Param("district") String district,
                                   @Param("playType") String playType,
                                   Pageable pageable);


   List<Request> findByOno(int ono); // findByOno
   List<Request> findByMno(int mno); // getMyOrdersByMemberNo에서 사용 메서드
   List<Request> findByFinishedAndOregdateBefore(int finished, LocalDateTime before); //삭제 기한 지난 견적 조회
   Page<Request> findByMnoAndFinished(int mno, int finished, Pageable pageable);

   // 여러 finished 상태를 한 번에 조회하기 위한 메서드
   @Query("SELECT r FROM Request r WHERE r.mno = :mno AND r.finished IN :finishedStatusList")
   Page<Request> findByMnoAndFinishedIn(@Param("mno") int mno, @Param("finishedStatusList") List<Integer> finishedStatusList, Pageable pageable);

   // finished가 null이면 모든 상태를 가져오고, 아니면 해당 finished 값으로 필터링
    @Query("SELECT r FROM Request r WHERE " +
           "(:finishedParam IS NULL OR r.finished = :finishedParam)")
    Page<Request> findByFinishedFilter(@Param("finishedParam") Integer finished, Pageable pageable);

    // 주석: 진행 중인 order 중 가장 최신 1건
    Optional<Request> findTopByMnoAndFinishedOrderByOregdateDesc(Long mno, int finished);

    // 주석: 진행/완료 order
    int countByMnoAndFinished(Long mno, int finished); 
    int countByMnoAndFinishedNot(Long mno, int finished); 
    int countByMno(Long mno);

    //주석: 탈퇴시 삭제처리
      void deleteByMno(Long mno);

}