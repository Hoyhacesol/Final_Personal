package com.sports.kickauction.service;

import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.entity.Biz;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.BizRepository;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.repository.SellerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BizServiceImpl implements BizService {

    private final MemberRepository memberRepository;
    private final SellerRepository sellerRepository;
    private final RequestRepository requestRepository;
    private final BizRepository bizRepository;

    @Override
    public Optional<Member> getLoggedInMember() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }

        String userId;
        if (auth.getPrincipal() instanceof OAuth2User oauthUser) {
            userId = (String) oauthUser.getAttributes().get("user_id");
        } else {
            userId = auth.getName();
        }

        return memberRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void registerBiz(Long mno, BizRegisterDTO dto) {
        Seller seller = sellerRepository.findById(mno)
                .orElseThrow(() -> new IllegalArgumentException("판매자 정보가 없습니다."));

        Request request = requestRepository.findById(dto.getOno())
                .orElseThrow(() -> new IllegalArgumentException("요청 정보가 없습니다."));

        Biz biz = Biz.builder()
                .seller(seller)
                .request(request)
                .price(dto.getPrice())
                .bcontent(dto.getBcontent())
                .banswer(dto.getBanswer())
                .build();

        bizRepository.save(biz);
    }

    @Override
    public boolean hasAlreadyBid(Long mno, Long ono) {
        return bizRepository.existsBySeller_MnoAndRequest_Ono(mno, ono);
    }

    @Override
    public Long getSellerMnoByOrderOno(Long ono) {
        return bizRepository.findSellerMnoByRequestOno(ono);
    }
}
