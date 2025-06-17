package com.sports.kickauction.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerRegisterDTO {
  private List<String> simage;
  private String introContent;
  private String info;
}
