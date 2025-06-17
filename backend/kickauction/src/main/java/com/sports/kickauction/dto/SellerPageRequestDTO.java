package com.sports.kickauction.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class SellerPageRequestDTO {
  private int page;
  private int size;

  public SellerPageRequestDTO() {
        this.page = 1;
        this.size = 12;  
    }

  public Pageable getPageable(Sort sort) {
      return PageRequest.of(this.page - 1, this.size, sort);
  }
}
