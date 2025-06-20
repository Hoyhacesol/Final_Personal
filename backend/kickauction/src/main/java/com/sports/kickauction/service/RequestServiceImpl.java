package com.sports.kickauction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.repository.RequestRepository;

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
                .regdate(order.getRegdate())
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
    public void parseDateTimeAndSetOrderDTO(String datetimeString, RequestDTO requestDTO) {
        if (datetimeString == null || datetimeString.isEmpty()) {
            return;
        }

        String[] parts = datetimeString.split("\\|");
        if (parts.length > 0) {
            try {
                String datePart = parts[0].trim();
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
                java.util.Date parsedUtilDate = dateFormat.parse(datePart);
                requestDTO.setRentalDate(LocalDateTime.ofInstant(parsedUtilDate.toInstant(), ZoneId.systemDefault()));
            } catch (ParseException e) {
                System.err.println("날짜 파싱 오류: " + e.getMessage());
                requestDTO.setRentalDate(null);
            }
        }
        if (parts.length > 1) {
            requestDTO.setRentalTime(parts[1].trim());
        } else {
            requestDTO.setRentalTime("");
        }
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
            .regdate(LocalDateTime.now())
            .finished(0)
            .build();

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
            .regdate(request.getRegdate())
            .finished(request.getFinished())
            .build();
    }

    /**
     * 견적 요청을 삭제(취소)합니다.
     * 비즈니스 규칙에 따라 물리적 삭제(DELETE) 대신 논리적 삭제(finished 상태 변경)를 권장합니다.
     *
     * @param requestDTO 삭제할 견적의 ono를 포함하는 DTO
     * @return 삭제(취소) 성공 시 true, 실패 시 false
     */
    @Override
    public boolean deleteOrder(RequestDTO requestDTO) {
        Optional<Request> existingOrderOptional = requestRepository.findById(requestDTO.getOno());  

        if (existingOrderOptional.isPresent()) {
            Request existingOrder = existingOrderOptional.get(); 

            // 논리적 삭제 (Soft Delete): finished 필드를 '취소' 상태(2)로 변경
            existingOrder.setFinished(2); // 2: 취소된 견적
            requestRepository.save(existingOrder); // 변경된 상태 저장

            return true; // 논리적 삭제 성공
        }
        return false; // 해당 ono의 견적을 찾을 수 없음
    }
}