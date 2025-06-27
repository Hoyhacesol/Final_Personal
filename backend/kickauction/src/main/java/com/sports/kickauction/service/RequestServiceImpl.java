package com.sports.kickauction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.repository.RequestRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@Transactional
public class RequestServiceImpl implements RequestService {

    @Autowired
    private RequestRepository requestRepository;  

    @Override
    public RequestDTO getOrderDetails(int ono) {
        Optional<Request> orderOptional = requestRepository.findById(ono);  
        Request order = orderOptional.orElse(null);  

        if (order != null) {
            RequestDTO dto = RequestDTO.builder()
                .ono(order.getOno())
                .mno(order.getMno())
                .playType(order.getPlayType())
                .olocation(order.getOlocation())
                .rentalDate(order.getRentalDate())
                .rentalTime(order.getRentalTime())
                .person(order.getPerson())
                .rentalEquipment(order.getRentalEquipment())
                .ocontent(order.getOcontent())
                .oregdate(order.getOregdate())
                .finished(order.getFinished())
                .build();
            return dto;
        }
        return null;
    }

    @Override
    public boolean updateOrder(RequestDTO requestDTO) {
        Optional<Request> existingOrderOptional = requestRepository.findById(requestDTO.getOno());  

        if (existingOrderOptional.isPresent()) {
            Request existingOrder = existingOrderOptional.get();  

            if (requestDTO.getPlayType() != null) existingOrder.setPlayType(requestDTO.getPlayType());
            if (requestDTO.getOlocation() != null) existingOrder.setOlocation(requestDTO.getOlocation());
            if (requestDTO.getRentalDate() != null) existingOrder.setRentalDate(requestDTO.getRentalDate());
            if (requestDTO.getRentalTime() != null) existingOrder.setRentalTime(requestDTO.getRentalTime());
            if (requestDTO.getPerson() != null) {
                existingOrder.setPerson(requestDTO.getPerson());
            } else {
                existingOrder.setPerson(null);
            }
            if (requestDTO.getRentalEquipment() != null) existingOrder.setRentalEquipment(requestDTO.getRentalEquipment());
            if (requestDTO.getOcontent() != null) existingOrder.setOcontent(requestDTO.getOcontent());

            requestRepository.save(existingOrder);  
            return true;
        }
        return false;
    }

    @Override
    public boolean createOrder(RequestDTO requestDTO) {
        Request newOrder = Request.builder()  
            .mno(requestDTO.getMno())
            .playType(requestDTO.getPlayType())
            .olocation(requestDTO.getOlocation())
            .rentalDate(requestDTO.getRentalDate())
            .rentalTime(requestDTO.getRentalTime())
            .person(requestDTO.getPerson())
            .rentalEquipment(requestDTO.getRentalEquipment())
            .ocontent(requestDTO.getOcontent())
            .oregdate(LocalDateTime.now())
            .finished(0)
            .build();

            try {
                requestRepository.save(newOrder);
                System.out.println("wtf : "+newOrder);
            } catch (Exception e) {
                log.error("견적 생성 중 데이터베이스 저장 오류 발생: " + e.getMessage(), e);
                System.out.println("wtf : "+newOrder);
            }
        Request savedOrder = requestRepository.save(newOrder);  
        requestDTO.setOno(savedOrder.getOno());

        return savedOrder.getOno() > 0;
    }

    @Override
    public Map<String, Object> getMyOrdersByMemberNo(int memberNo) {
        // RequestRepository에 findByMno 메서드를 사용하여 실제 데이터를 가져옵니다.
        List<Request> allOrdersForMember = requestRepository.findByMno(memberNo); 

        Map<String, Object> myOrdersData = new HashMap<>();

        // 활성 주문 (finished = 0)
        List<RequestDTO> activeOrders = allOrdersForMember.stream()
                                            .filter(order -> order.getFinished() == 0)
                                            .map(this::convertToDto)
                                            .collect(Collectors.toList());
        myOrdersData.put("activeOrders", activeOrders);


        // 마감된 주문 (finished = 1)
        List<RequestDTO> closedOrders = allOrdersForMember.stream()
                                            .filter(order -> order.getFinished() == 1)
                                            .map(this::convertToDto)
                                            .collect(Collectors.toList());
        myOrdersData.put("closedOrders", closedOrders);


        // 취소된 주문 (finished = 2)
        List<RequestDTO> cancelledOrders = allOrdersForMember.stream()
                                                .filter(order -> order.getFinished() == 2)
                                                .map(this::convertToDto)
                                                .collect(Collectors.toList());
        myOrdersData.put("cancelledOrders", cancelledOrders);

        return myOrdersData;
    }

    // 엔티티를 DTO로 변환하는 헬퍼 메서드
    private RequestDTO convertToDto(Request request) {  
        return RequestDTO.builder()
            .ono(request.getOno())
            .mno(request.getMno())
            .playType(request.getPlayType())
            .olocation(request.getOlocation())
            .rentalDate(request.getRentalDate())
            .rentalTime(request.getRentalTime())
            .person(request.getPerson())
            .rentalEquipment(request.getRentalEquipment())
            .ocontent(request.getOcontent())
            .oregdate(request.getOregdate())
            .finished(request.getFinished())
            .build();
    }

    /*
     * 견적 요청을 삭제(취소) / 논리적 삭제(finished 상태 변경)
     */
    @Override
    public boolean deleteOrder(RequestDTO requestDTO) {
        Optional<Request> existingOrderOptional = requestRepository.findById(requestDTO.getOno());  

        if (existingOrderOptional.isPresent()) {
            Request existingOrder = existingOrderOptional.get(); 

            // 논리적 삭제 (Soft Delete): finished 필드를 '취소' 상태(2)로 변경
            existingOrder.setFinished(2);
            requestRepository.save(existingOrder); // 변경된 상태 저장

            return true; // 논리적 삭제 성공
        }
        return false; // 해당 ono의 견적을 찾을 수 없음
    }

    // finished 상태 변경
    @Override
    public boolean updateFinished (RequestDTO requestDTO) {
        Optional<Request> existingOrderOptional = requestRepository.findById(requestDTO.getOno());  

        if (existingOrderOptional.isPresent()) {
            Request existingOrder = existingOrderOptional.get();  
            
            final int active = 0;
            final int end = 1;
            final int cancel = 2;

            if (requestDTO.getFinished()==active) {
                existingOrder.setFinished(end);
                requestRepository.save(existingOrder);  
                return true;
            }
            else if (requestDTO.getFinished()==end) {
                existingOrder.setFinished(active);
                requestRepository.save(existingOrder);  
                return true;
            }
            // else if (requestDTO.getFinished()==cancel) {
            //     existingOrder.setFinished(active);
            //     requestRepository.save(existingOrder);  
            //     return true;
            // }
        }
        return false;
    }
}