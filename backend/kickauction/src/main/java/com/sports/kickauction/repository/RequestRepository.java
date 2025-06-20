package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // findByMno
//import java.util.Optional; // 단일 객체를 조회할 때 Optional 사용 권장

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {

    List<Request> findByMno(int mno); // getMyOrdersByMemberNo에서 사용 메서드
    List<Request> findByMnoAndFinished(int mno, int finished); // finished 상태별 조회
}