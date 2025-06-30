package com.sports.kickauction.service;

import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;

public interface CommunityService {

    CommunityDTO register(CommunityDTO communityDto,MultipartFile pimageFile);

    CommunityDTO get(Long pno);

    void incrementViewCount(Long pno);

    void modify(CommunityDTO communityDto,MultipartFile pimageFile);

    void remove(Long pno);

    PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO);

     CommunityDTO getPrevious(Long pno);
     
     CommunityDTO getNext(Long pno);
}
