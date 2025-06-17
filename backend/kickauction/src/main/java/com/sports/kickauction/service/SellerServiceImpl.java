package com.sports.kickauction.service;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
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

    @Override
    public SellerReadDTO getSellerByMno(Long mno) {
        Seller seller = sellerRepository.findById(mno).orElse(null);
        if (seller != null && seller.getSellerIntro() != null) {
            SellerIntro intro = seller.getSellerIntro();

            return SellerReadDTO.builder()
                    .mno(seller.getMno())
                    .sname(seller.getSname())
                    .slocation(seller.getSlocation())
                    .introContent(intro.getIntroContent())
                    .simage(intro.getSimage() != null ? intro.getSimage().split(",") : new String[0])
                    .hiredCount(intro.getHiredCount())
                    .info(intro.getInfo())
                    .phone(seller.getMember().getPhone())
                    .build();
        }
        return null;
    }

    @Transactional
    @Override
    public void registerSeller(Long mno, SellerRegisterDTO dto) {
        try {
            Seller seller = sellerRepository.findById(mno)
                    .orElseThrow(() -> new NoSuchElementException("해당 회원 없음"));

            String simageCombined = String.join(",", dto.getSimage());

            SellerIntro sellerIntro = SellerIntro.builder()
                    .seller(seller)
                    .introContent(dto.getIntroContent())
                    .info(dto.getInfo())
                    .simage(simageCombined)
                    .hiredCount(0)
                    .build();

            sellerIntroRepository.save(sellerIntro);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public SellerPageResponseDTO<SellerReadDTO> getSellerList(SellerPageRequestDTO sellerPageRequestDTO) {
        Pageable pageable = sellerPageRequestDTO.getPageable(Sort.by("mno").descending());

        Page<SellerIntro> result = sellerIntroRepository.findAll(pageable);

        List<SellerReadDTO> dtoList = result.stream().map(entity -> {
            Seller seller = entity.getSeller();

            return SellerReadDTO.builder()
                    .mno(seller.getMno())
                    .sname(seller.getSname())
                    .slocation(seller.getSlocation())
                    .phone(seller.getMember().getPhone())
                    .introContent(entity.getIntroContent())
                    .info(entity.getInfo())
                    .simage(entity.getSimage() != null ? entity.getSimage().split(",") : new String[0])
                    .hiredCount(entity.getHiredCount())
                    .build();
        }).collect(Collectors.toList());

        return SellerPageResponseDTO.<SellerReadDTO>builder()
                .dtoList(dtoList)
                .sellerPageRequestDTO(sellerPageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();
    }
}
