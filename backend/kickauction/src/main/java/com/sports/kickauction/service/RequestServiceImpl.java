package com.sports.kickauction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.dto.RequestPageRequestDTO;
import com.sports.kickauction.dto.RequestPageResponseDTO;
import com.sports.kickauction.dto.RequestReadDTO;
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
                .otitle(order.getOtitle())
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

            if (requestDTO.getOtitle() != null) existingOrder.setOtitle(requestDTO.getOtitle());
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
            .otitle(requestDTO.getOtitle())
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
            Request savedOrder = requestRepository.save(newOrder);
            requestDTO.setOno(savedOrder.getOno());
            // System.out.println("견적 저장 성공 ono: " + savedOrder.getOno());
            return savedOrder.getOno() > 0;
        } catch (Exception e) {
            log.error("견적 생성 중 DB 저장 오류 발생: " + e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Map<String, Object> getMyOrdersByMemberNo(int memberNo) {
        // RequestRepository에 findByMno 메서드를 사용하여 실제 데이터를 가져옵니다.
        List<Request> allOrdersForMember = requestRepository.findByMno(memberNo); 
        Map<String, Object> myOrdersData = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();

        // 취소 후 만료된 주문은 삭제
        List<Request> expiredCancelledOrders = allOrdersForMember.stream()
            .filter(order -> order.getFinished() == 2 && order.getOregdate().isBefore(now))
            .collect(Collectors.toList());

        if (!expiredCancelledOrders.isEmpty()) {
            requestRepository.deleteAll(expiredCancelledOrders); // 영구 삭제
            allOrdersForMember.removeAll(expiredCancelledOrders); // 로컬 리스트에서도 제거
        }

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
            .otitle(request.getOtitle())
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
            final long delDaySet = 3;
            final LocalDateTime setDateTime = LocalDateTime.now().plusDays(delDaySet);
            


            // 논리적 삭제 (Soft Delete): finished 필드를 '취소' 상태(2)로 변경
            existingOrder.setFinished(2);
            existingOrder.setOregdate(setDateTime); //물리삭제 시간 지정
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

    //견적 리스트
    @Override
public RequestPageResponseDTO<RequestReadDTO> getOrderList(RequestPageRequestDTO dto) {
    Pageable pageable = dto.getPageable(Sort.by("oregdate").descending());

    String city = dto.getCity();
    String district = dto.getDistrict();
    String playType = dto.getPlayType();

    Map<String, String> fullCityMap = new HashMap<>();
    fullCityMap.put("서울", "서울특별시");
    fullCityMap.put("부산", "부산광역시");
    fullCityMap.put("대구", "대구광역시");
    fullCityMap.put("인천", "인천광역시");
    fullCityMap.put("광주", "광주광역시");
    fullCityMap.put("대전", "대전광역시");
    fullCityMap.put("울산", "울산광역시");
    fullCityMap.put("세종", "세종특별자치시");
    fullCityMap.put("경기", "경기도");
    fullCityMap.put("강원", "강원도");
    fullCityMap.put("충북", "충청북도");
    fullCityMap.put("충남", "충청남도");
    fullCityMap.put("전북", "전라북도");
    fullCityMap.put("전남", "전라남도");
    fullCityMap.put("경북", "경상북도");
    fullCityMap.put("경남", "경상남도");
    fullCityMap.put("제주", "제주특별자치도");

    String fullCity = (city != null && !city.equals("전국") && !city.isBlank())
        ? fullCityMap.getOrDefault(city, city)
        : null;

    String districtParam = (district != null && !district.isBlank()) ? district : null;
    String playTypeParam = (playType != null && !playType.isBlank()) ? playType : null;

    Page<Request> result = requestRepository.findFilteredRequests(fullCity, districtParam, playTypeParam, pageable);

    List<RequestReadDTO> dtoList = result.getContent().stream()
        .map(req -> RequestReadDTO.builder()
            .ono(req.getOno())
            .ocontent(req.getOcontent())
            .playType(req.getPlayType())
            .olocation(req.getOlocation())
            .rentalDate(req.getRentalDate())
            .oregdate(req.getOregdate())
            .rentaltime(req.getRentalTime())
            .build())
        .collect(Collectors.toList());

    return RequestPageResponseDTO.<RequestReadDTO>builder()
        .dtoList(dtoList)
        .totalCount(result.getTotalElements())
        .RequestPageRequestDTO(dto)
        .build();
}




}