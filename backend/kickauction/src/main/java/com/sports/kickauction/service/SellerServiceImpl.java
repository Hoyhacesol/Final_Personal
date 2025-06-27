package com.sports.kickauction.service;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.sports.kickauction.dto.SellerModifyDTO;
import com.sports.kickauction.dto.SellerModifyReadDTO;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.dto.SellerRegisterReadDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;
import com.sports.kickauction.repository.SellerIntroRepository;
import com.sports.kickauction.repository.SellerRepository;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final SellerIntroRepository sellerIntroRepository;

    private static final String DEFAULT_IMAGE_PATH = "default/default.png";

    // 주석: ROLE 전환으로, SELLER로 변경된 회원의 mno로 seller테이블을 조회해 새로운 seller데이터를 추가할지 넘어갈지 정하기 위해 추가..
    @Override
    public boolean existsSeller(Long mno) {
        return sellerRepository.existsById(mno);
    }


    private String buildSimageString(List<String> simageList) {
    return (simageList == null || simageList.isEmpty())
            ? DEFAULT_IMAGE_PATH
            : String.join(",", simageList);
}

    private List<String> parseSimageString(String simage) {
    return (simage != null && !simage.isBlank())
            ? Arrays.stream(simage.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList())
            : List.of(DEFAULT_IMAGE_PATH);
}
    @Override
    public SellerReadDTO getSellerByMno(Long mno) {
        SellerIntro intro = sellerIntroRepository.findById(mno)
                .orElseThrow(() -> new NoSuchElementException("해당 업체 정보 없음"));

        Seller seller = intro.getSeller();

        List<String> simageList = parseSimageString(intro.getSimage());

        return SellerReadDTO.builder()
                .mno(seller.getMno())
                .sname(seller.getSname())
                .slocation(seller.getSlocation())
                .introContent(intro.getIntroContent())
                .simage(simageList.toArray(new String[0]))
                .hiredCount(intro.getHiredCount())
                .info(intro.getInfo())
                .phone(Optional.ofNullable(seller.getMember())
                .map(Member::getPhone)
                .orElse("정보 없음"))
                .build();
    }

    @Transactional
    @Override
    public void registerSeller(Long mno, SellerRegisterDTO dto) {
        Seller seller = sellerRepository.findById(mno)
                .orElseThrow(() -> new NoSuchElementException("해당 회원 없음"));

        if (sellerIntroRepository.existsBySeller(seller)) {
        throw new IllegalStateException("이미 업체를 등록하셨습니다.");
    }

        String simageCombined = buildSimageString(dto.getSimage());

        SellerIntro sellerIntro = SellerIntro.builder()
                .seller(seller)
                .introContent(dto.getIntroContent())
                .info(dto.getInfo())
                .simage(simageCombined)
                .hiredCount(0)
                .build();

        sellerIntroRepository.save(sellerIntro);
    }

    @Override
    public boolean isAlreadyRegistered(Long mno) {
        Seller seller = sellerRepository.findById(mno)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원의 업체 정보가 존재하지 않습니다."));
        return sellerIntroRepository.existsBySeller(seller);
    }

    @Override
    @Transactional
    public SellerPageResponseDTO<SellerReadDTO> getSellerList(SellerPageRequestDTO sellerPageRequestDTO) {
        Pageable pageable = sellerPageRequestDTO.getPageable(Sort.by("regDate").descending());

        Page<SellerIntro> result = sellerIntroRepository.findAll(pageable);

        List<SellerReadDTO> dtoList = result.stream().map(intro -> {
            Seller seller = intro.getSeller();

            String[] simageArr = parseSimageString(intro.getSimage()).toArray(new String[0]);

            return SellerReadDTO.builder()
                    .mno(seller.getMno())
                    .sname(seller.getSname())
                    .slocation(seller.getSlocation())
                    .phone(seller.getMember().getPhone())
                    .introContent(intro.getIntroContent())
                    .info(intro.getInfo())
                    .simage(simageArr)
                    .hiredCount(intro.getHiredCount())
                    .build();
        }).collect(Collectors.toList());

        return SellerPageResponseDTO.<SellerReadDTO>builder()
                .dtoList(dtoList)
                .sellerPageRequestDTO(sellerPageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();
    }

    @Override
    public SellerRegisterReadDTO getSellerRegisterInfo(Long mno) {
        Seller seller = sellerRepository.findById(mno)
                .orElseThrow(() -> new IllegalArgumentException("해당 판매자를 찾을 수 없습니다. mno=" + mno));

       

        return SellerRegisterReadDTO.builder()
                .sname(seller.getSname())
                .slocation(seller.getSlocation())
                .phone(seller.getMember().getPhone())
                .build();
    }

    @Override
    public SellerModifyReadDTO getSellerModifyInfo(Long mno) {
    Seller seller = sellerRepository.findById(mno)
        .orElseThrow(() -> new NoSuchElementException("판매자 정보 없음"));

    SellerIntro intro = sellerIntroRepository.findById(mno)
        .orElseThrow(() -> new NoSuchElementException("소개 정보 없음"));

    List<String> simageList = parseSimageString(intro.getSimage());

    return SellerModifyReadDTO.builder()
        .sname(seller.getSname())
        .slocation(seller.getSlocation())
        .introContent(intro.getIntroContent())
        .info(intro.getInfo())
        .phone(seller.getMember().getPhone())
        .simage(simageList)
        .build();
}
    
    @Override
    @Transactional
    public void modifySeller(Long mno, SellerModifyDTO dto) {
        Seller seller = sellerRepository.findById(mno)
            .orElseThrow(() -> new NoSuchElementException("해당 판매자 정보 없음"));

        SellerIntro intro = sellerIntroRepository.findById(mno)
            .orElseThrow(() -> new NoSuchElementException("해당 업체 소개 정보 없음"));

        // 수정
        seller.setSname(dto.getSname());
        seller.setSlocation(dto.getSlocation());

        intro.setSimage(buildSimageString(dto.getSimage()));
        intro.setIntroContent(dto.getIntroContent());
        intro.setInfo(dto.getInfo());

        // 저장
        sellerRepository.save(seller);         
        sellerIntroRepository.save(intro);    
    }

}
