package com.sports.kickauction.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class RequestPageCustomReqDTO {
  private int page;
  private int size;
  
  private String status;   // "active", "closed", "cancelled" 등 상태 전달용
  private Integer finished; // finished 숫자 값 직접 전달용

  public RequestPageCustomReqDTO() {
        this.page = 1;
        this.size = 3;  
    }

  public Pageable getPageable(Sort sort) {
      return PageRequest.of(this.page - 1, this.size, sort);
  }
}
