package com.sports.kickauction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sports.kickauction.entity.Biz;
import com.sports.kickauction.entity.Request;

public interface BizRepository extends JpaRepository<Biz, Long> {
  boolean existsBySeller_MnoAndRequest_Ono(Long mno, Long ono);

  List<Biz> findByRequest_Ono(int ono);

 @Query("""
        SELECT b.seller.mno
        FROM Biz b
        WHERE b.request.ono = :ono
    """)
    Long findSellerMnoByRequestOno(@Param("ono") Long ono);

    // 주석: order에 달린 개수
    int countByRequest(Request request);

    // 주석: 자신의 모든 biz 개수
    int countBySeller_Mno(Long mno);

    //주석: 탈퇴시 삭제처리
    void deleteBySeller_Mno(Long mno);

    // 입찰 여부 확인
    boolean existsByRequest_OnoAndSeller_Mno(int ono, Long mno);

    //입찰 삭제
    Optional<Biz> findBySeller_MnoAndRequest_Ono(Long mno, Long ono);

    //입찰 수정
    Optional<Biz> findBySeller_MnoAndRequest_Ono(Long mno, int ono);

    // 삭제 이력 확인용
    boolean existsByRequest_OnoAndSeller_MnoAndDeletedTrue(int ono, Long mno);
    

}
