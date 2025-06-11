package com.sports.kickauction.service;

import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;

public interface CommunityService {

    Long register(CommunityDTO communityDto);

    CommunityDTO get(Long pno);

    void modify(CommunityDTO communityDto);

    void remove(Long pno);

    PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO);

}
