package com.sports.kickauction.service;

import com.sports.kickauction.dto.BizModifyDTO;
import com.sports.kickauction.dto.BizRegisterDTO;
import com.sports.kickauction.entity.Biz;
import com.sports.kickauction.entity.Request;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.BizRepository;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.repository.SellerRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BizServiceImpl implements BizService {

    private final MemberRepository memberRepository;
    private final SellerRepository sellerRepository;
    private final RequestRepository requestRepository;
    private final BizRepository bizRepository;
     private final MessageService messageService;

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

        
                // 견적 상태 확인
        if (request.getFinished() == 1) {
            throw new IllegalArgumentException("이미 마감된 견적입니다.");
        } else if (request.getFinished() == 2) {
            throw new IllegalArgumentException("취소된 견적입니다.");
        } else if (request.getFinished() == 11) {
            throw new IllegalArgumentException("이미 낙찰된 견적입니다.");
        }

        // 이미 입찰한 경우
        if (bizRepository.existsByRequest_OnoAndSeller_Mno(dto.getOno(), mno)) {
            throw new IllegalArgumentException("이미 입찰하셨습니다.");
        }
        if (request.getMno() == seller.getMember().getMno()) {
            throw new IllegalArgumentException("자신이 작성한 요청에는 입찰할 수 없습니다.");
        }
        // 삭제 이력이 있는 경우 재입찰 금지
        if (bizRepository.existsByRequest_OnoAndSeller_MnoAndDeletedTrue(dto.getOno(), mno)) {
            throw new IllegalArgumentException("이전에 입찰을 삭제하셨기 때문에 재입찰할 수 없습니다.");
        }

        Biz biz = Biz.builder()
                .seller(seller)
                .request(request)
                .price(dto.getPrice())
                .bcontent(dto.getBcontent())
                .banswer(dto.getBanswer())
                 .deleted(false)
                .build();

        bizRepository.save(biz);

            // 메시지 수신자 조회 (request.getMno()는 int → long 변환)
    Member receiver = memberRepository.findById((long) request.getMno())
            .orElseThrow(() -> new IllegalArgumentException("회원이 없습니다."));

    // 메시지 전송
    messageService.sendSystemMessageForBiz(
        seller.getMember(),
        receiver,
        request.getOtitle(),
        dto.getPrice()
);
    }

    @Override
    public boolean hasAlreadyBid(Long mno, Long ono) {
        return bizRepository.existsBySeller_MnoAndRequest_Ono(mno, ono);
    }

    @Override
    public Long getSellerMnoByOrderOno(Long ono) {
        return bizRepository.findSellerMnoByRequestOno(ono);
    }

    @Override
    @Transactional
    public void deleteBiz(Long mno, Long ono) {
        Biz biz = bizRepository.findBySeller_MnoAndRequest_Ono(mno, ono)
                .orElseThrow(() -> new IllegalArgumentException("해당 입찰 제안이 존재하지 않습니다."));

                Request request = biz.getRequest();

        // 마감 또는 낙찰된 견적은 삭제 불가
        int status = biz.getRequest().getFinished();
        if (status == 1) {
            throw new IllegalArgumentException("마감된 입찰은 삭제할 수 없습니다.");
        } else if (status == 11) {
            throw new IllegalArgumentException("낙찰된 입찰은 삭제할 수 없습니다.");
        }
        String timeStr = request.getRentalTime(); // "14:00" 형식
        LocalDateTime rentalDateTime = request.getRentalDate()
                .withHour(Integer.parseInt(timeStr.split(":")[0]))
                .withMinute(Integer.parseInt(timeStr.split(":")[1]));

        LocalDateTime now = LocalDateTime.now();

        if (rentalDateTime.isBefore(now) || Duration.between(now, rentalDateTime).toHours() < 12) {
            throw new IllegalArgumentException("대여 12시간 이내에는 입찰 제안을 수정할 수 없습니다.");
        }

        biz.setDeleted(true);
        bizRepository.save(biz);
    }


    @Override
    @Transactional(readOnly = true)
    public BizRegisterDTO getBizDetail(Long mno, Long ono) {
        Biz biz = bizRepository.findBySeller_MnoAndRequest_Ono(mno, ono)
                .orElseThrow(() -> new IllegalArgumentException("입찰 정보가 존재하지 않습니다."));

        return BizRegisterDTO.builder()
                .ono(biz.getRequest().getOno())
                .price(biz.getPrice())
                .bcontent(biz.getBcontent())
                .banswer(biz.getBanswer())
                .build();
    }

    @Override
    @Transactional
    public void modifyBiz(Long mno, BizModifyDTO dto) {
    Biz biz = bizRepository.findBySeller_MnoAndRequest_Ono(mno, dto.getOno())
            .orElseThrow(() -> new IllegalArgumentException("입찰 정보를 찾을 수 없습니다."));

    Request request = biz.getRequest();

    if (request.getFinished() == 1) {
        throw new IllegalArgumentException("마감된 견적은 수정할 수 없습니다.");
    }

    //  공정성 체크: 12시간 이내면 수정 불가
    String timeStr = request.getRentalTime(); // "14:00" 형식
    LocalDateTime rentalDateTime = request.getRentalDate()
            .withHour(Integer.parseInt(timeStr.split(":")[0]))
            .withMinute(Integer.parseInt(timeStr.split(":")[1]));

    LocalDateTime now = LocalDateTime.now();

    if (rentalDateTime.isBefore(now) || Duration.between(now, rentalDateTime).toHours() < 12) {
        throw new IllegalArgumentException("대여 12시간 이내에는 입찰 제안을 수정할 수 없습니다.");
    }

    biz.setPrice(dto.getPrice());
    biz.setBcontent(dto.getBcontent());
    biz.setBanswer(dto.getBanswer());

    bizRepository.save(biz);
}   
    @Override
    public void checkBizEditable(Long mno, Long ono) {
    Biz biz = bizRepository.findBySeller_MnoAndRequest_Ono(mno, ono)
        .orElseThrow(() -> new IllegalArgumentException("입찰 정보가 없습니다."));

    Request request = biz.getRequest();
    String timeStr = request.getRentalTime();
    LocalDateTime rentalDateTime = request.getRentalDate()
        .withHour(Integer.parseInt(timeStr.split(":")[0]))
        .withMinute(Integer.parseInt(timeStr.split(":")[1]));

    LocalDateTime now = LocalDateTime.now();
    if (rentalDateTime.isBefore(now) || Duration.between(now, rentalDateTime).toHours() < 12) {
        throw new IllegalArgumentException("대여 12시간 이내에는 입찰 제안을 수정할 수 없습니다.");
    }
}
    @Override
    public boolean hasDeletedBid(Long mno, int ono) {
        return bizRepository.existsByRequest_OnoAndSeller_MnoAndDeletedTrue(ono, mno);
    }


}
