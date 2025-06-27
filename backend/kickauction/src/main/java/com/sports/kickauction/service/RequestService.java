package com.sports.kickauction.service;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.dto.RequestPageRequestDTO;
import com.sports.kickauction.dto.RequestPageResponseDTO;
import com.sports.kickauction.dto.RequestReadDTO;

import java.util.Map;

public interface RequestService {

    //견적 리스트
    RequestPageResponseDTO<RequestReadDTO> getOrderList(RequestPageRequestDTO requestPageRequestDTO);

    // ono를 사용하여 견적 상세 정보를 가져옵니다.
    RequestDTO getOrderDetails(int ono);

    // RequestDTO를 사용하여 견적 정보를 업데이트합니다.
    boolean updateOrder(RequestDTO requestDTO);

    // 새로운 견적 요청을 생성합니다.
    boolean createOrder(RequestDTO requestDTO);

    // 견적 요청을 삭제(취소)합니다.
    boolean deleteOrder(RequestDTO requestDTO);

    //견적 상태 업데이트
    boolean updateFinished (RequestDTO requestDTO);

    // 특정 회원의 견적 목록(활성, 마감, 취소)을 가져옵니다.
    Map<String, Object> getMyOrdersByMemberNo(int memberNo);
}