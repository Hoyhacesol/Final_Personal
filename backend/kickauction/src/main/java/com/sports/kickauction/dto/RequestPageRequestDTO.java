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
public class RequestPageRequestDTO {
  private int page;
  private int size;

  private String city;     
  private String district;
  private String playType;

  public RequestPageRequestDTO() {
        this.page = 1;
        this.size = 5;  
    }

  public Pageable getPageable(Sort sort) {
      return PageRequest.of(this.page - 1, this.size, sort);
  }
}
