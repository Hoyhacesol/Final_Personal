package com.sports.kickauction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.RequestDTO;
import com.sports.kickauction.dto.RequestPageCustomReqDTO;
import com.sports.kickauction.dto.RequestPageCustomResDTO;
import com.sports.kickauction.dto.RequestPageRequestDTO;
import com.sports.kickauction.dto.RequestPageResponseDTO;
import com.sports.kickauction.dto.RequestReadDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.RequestProposalResDTO;
import com.sports.kickauction.entity.Biz;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.BizRepository;
import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.repository.ReviewRepository;
import com.sports.kickauction.repository.SellerIntroRepository;
import com.sports.kickauction.dto.PageResponseDTO;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@Transactional
public class RequestServiceImpl implements RequestService {

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private BizRepository bizRepository;
    @Autowired
    private SellerIntroRepository sellerIntroRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MemberRepository memberRepository;




    @Override
    public RequestDTO getOrderDetails(int ono) {
        // 1. 견적(Request) 정보 조회. 없으면 예외 발생.
        Request order = requestRepository.findById(ono)
                .orElseThrow(() -> new EntityNotFoundException("견적 정보를 찾을 수 없습니다. ID: " + ono));

        // 2. 작성자(Member) 정보 조회. 없으면 예외 발생.
        Member writer = memberRepository.findById(Long.valueOf(order.getMno()))
                .orElseThrow(() -> new EntityNotFoundException("작성자 정보를 찾을 수 없습니다. ID: " + order.getMno()));

        // 3. DTO 빌드
        RequestDTO dto = RequestDTO.builder()
            .ono(order.getOno())
            .mno(order.getMno())
            .writerNickname(writer.getUserName()) // 닉네임 설정
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

        // 4. 제안한 업체(Biz) 목록 조회 및 DTO에 추가
        //isDeleted()는 가져오지않음
        List<Biz> bizList = bizRepository.findByRequest_Ono(ono).stream()
        .filter(b -> !b.isDeleted())
        .collect(Collectors.toList());

        // N+1 문제 해결: 필요한 SellerIntro 정보를 한번의 쿼리로 가져옵니다.
        List<Long> sellerMnos = bizList.stream()
                .map(biz -> biz.getSeller().getMno())
                .collect(Collectors.toList());

        Map<Long, SellerIntro> sellerIntroMap = sellerIntroRepository.findAllById(sellerMnos).stream()
                .collect(Collectors.toMap(SellerIntro::getMno, intro -> intro));

        List<RequestProposalResDTO> companies = bizList.stream().map(biz -> {
            Seller bizSeller = biz.getSeller();
            BizRegisterDTO bizDTO = BizRegisterDTO.builder()
                .ono(biz.getRequest().getOno())
                .price(biz.getPrice())
                .bcontent(biz.getBcontent())
                .banswer(biz.getBanswer())
                .build();

            SellerIntro intro = sellerIntroMap.get(bizSeller.getMno());
            if (intro == null) return null; // 혹시 모를 예외 상황 방지

            SellerReadDTO sellerDTO = SellerReadDTO.builder()
                .mno(bizSeller.getMno())
                .sname(bizSeller.getSname())
                .slocation(bizSeller.getSlocation())
                .hiredCount(intro.getHiredCount())
                .build();

            return RequestProposalResDTO.builder()
                .biz(bizDTO)
                .seller(sellerDTO)
                .build();
        }).filter(java.util.Objects::nonNull).collect(Collectors.toList());
        dto.getAttributes().put("companies", companies);
        
        return dto;
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

        // LocalDateTime now = LocalDateTime.now();

        // // 취소 후 만료된 주문은 삭제
        // List<Request> expiredCancelledOrders = allOrdersForMember.stream()
        //     .filter(order -> order.getFinished() == 2 && order.getOregdate().isBefore(now))
        //     .collect(Collectors.toList());

        // if (!expiredCancelledOrders.isEmpty()) {
        //     requestRepository.deleteAll(expiredCancelledOrders); // deleteAll을 사용해야 Cascade가 정상 동작합니다.
        //     allOrdersForMember.removeAll(expiredCancelledOrders); // 로컬 리스트에서도 제거
        // }

        // 활성 주문 (finished = 0)
        List<RequestDTO> activeOrders = allOrdersForMember.stream()
                                            .filter(order -> order.getFinished() == 0)
                                            .map(this::convertToDto)
                                            .collect(Collectors.toList());
        myOrdersData.put("activeOrders", activeOrders);


        // 마감된 주문 (finished = 1)
        List<RequestDTO> closedOrders = allOrdersForMember.stream()
                                            .filter(order -> order.getFinished() == 1 || order.getFinished() == 11)
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

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// --- getMyOrdersByStatusPaginated ---
    @Override
    @Transactional
    public RequestPageCustomResDTO<RequestDTO> getMyOrdersByStatusPaginated(int memberNo, RequestPageCustomReqDTO dto) {
        
        String status = dto.getStatus();

        // '취소' 목록을 조회할 때만, 만료된 취소 견적을 먼저 삭제합니다.
        if ("cancelled".equals(status)) {
            List<Request> allOrdersForMember = requestRepository.findByMno(memberNo);
            LocalDateTime now = LocalDateTime.now();

            List<Request> expiredCancelledOrders = allOrdersForMember.stream()
                .filter(order -> order.getFinished() == 2 && order.getOregdate() != null && order.getOregdate().isBefore(now))
                .collect(Collectors.toList());

            if (!expiredCancelledOrders.isEmpty()) {
                requestRepository.deleteAll(expiredCancelledOrders);
                requestRepository.flush(); // DB에 즉시 반영하여 이후 조회에서 제외되도록 합니다.
            }
        }

        Pageable pageable = dto.getPageable(Sort.by("ono").descending());

        Page<Request> result;
        switch (status) {
            case "active":
                result = requestRepository.findByMnoAndFinished(memberNo, 0, pageable);
                break;
            case "closed":
                result = requestRepository.findByMnoAndFinishedIn(memberNo, List.of(1, 11), pageable);
                break;
            case "cancelled":
                result = requestRepository.findByMnoAndFinished(memberNo, 2, pageable);
                break;
            default:
                throw new IllegalArgumentException("Invalid status provided: " + status);
        }
        
        List<RequestDTO> dtoList = result.getContent().stream()
                .map(this::convertToRequestDTO) // 메서드명 변경: Request -> RequestDTO 변환
                .collect(Collectors.toList());

        return new RequestPageCustomResDTO<>(dtoList, dto, result.getTotalElements());
    }

    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

    // Request 엔티티를 RequestDTO로 변환하는 헬퍼 메서드
    private RequestDTO convertToRequestDTO(Request request) {
        boolean hasReview = reviewRepository.existsByOno(Long.valueOf(request.getOno()));
        log.info("리뷰 확인: ono=" + request.getOno() + ", hasReview=" + hasReview);

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
            .hasReview(hasReview) // 리뷰 존재 여부 설정
            .build();
    }

    @Transactional
    public void confirmCompanyAndFinalizeOrder(int ono, Long selectedSellerMno) {
        // 1. 해당 ono의 Order(견적) 정보가 존재하는지 확인합니다.
        Request order = requestRepository.findById(ono)
                .orElseThrow(() -> new EntityNotFoundException("견적 정보를 찾을 수 없습니다. ID: " + ono));

        // 2. 해당 견적에 제안된 모든 Biz(입찰) 목록을 가져옵니다.
        List<Biz> allBids = bizRepository.findByRequest_Ono(ono);
        if (allBids.isEmpty()) {
            throw new IllegalStateException("해당 견적에 대한 입찰 정보가 없습니다. ID: " + ono);
        }

        // 3. 선택되지 않은 나머지 입찰들을 필터링하여 삭제 목록을 만듭니다.
        // (Biz 엔티티에 Seller(Member) 정보가 연관관계로 맺어져 있다고 가정)
        List<Biz> bidsToDelete = allBids.stream()
                .filter(biz -> !biz.getSeller().getMno().equals(selectedSellerMno))
                .collect(Collectors.toList());

        // 4. 선택되지 않은 입찰들을 삭제합니다.
        if (!bidsToDelete.isEmpty()) {
            bizRepository.deleteAll(bidsToDelete);
        }

        // 4-1. 선택된 업체의 hiredCount를 1 증가시킵니다.
        SellerIntro sellerIntro = sellerIntroRepository.findById(selectedSellerMno)
                .orElseThrow(() -> new EntityNotFoundException("선택된 업체 정보를 찾을 수 없습니다. ID: " + selectedSellerMno));

        sellerIntro.setHiredCount(sellerIntro.getHiredCount() + 1);
        // @Transactional에 의해 변경 감지(Dirty Checking)가 되므로 save()는 선택사항이지만 명시적으로 추가합니다.
        sellerIntroRepository.save(sellerIntro);

        // 5. Order의 상태를 '업체 선정 완료' (finished = 11)로 업데이트합니다.
        order.setFinished(11); 
        requestRepository.save(order);
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
            // 현재 DB의 상태가 '진행중'일 때만 '마감'으로 변경합니다.
            // 다른 트랜잭션(예: 사용자 취소)에 의해 상태가 이미 변경된 경우, 충돌을 방지하기 위해 업데이트를 수행하지 않습니다.
            if (existingOrder.getFinished() == active) {
                existingOrder.setFinished(end);
                requestRepository.save(existingOrder);
            }
            return true; // 작업이 성공적으로 처리되었거나, 이미 처리된 상태이므로 true를 반환합니다.
        }
        return false;
    }
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
            .otitle(req.getOtitle())
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