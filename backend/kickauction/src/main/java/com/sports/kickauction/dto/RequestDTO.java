package com.sports.kickauction.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.lang.Integer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {
    private int ono;
    private int mno;
    private String otitle;
    @JsonProperty("region")
    private String olocation;
    private String playType;
    private LocalDateTime rentalDate;
    private String rentalTime;
    private Integer person;
    private String rentalEquipment;
    private String ocontent;
    private LocalDateTime oregdate;
    private int finished;


    private boolean hasReview; // 리뷰 여부(DB와 무관)

    @Builder.Default
    private Map<String, Object> extraAttributes = new HashMap<>();

    @JsonAnySetter
    public void setExtraAttribute(String key, Object value) {
        extraAttributes.put(key, value);
    }

    public Map<String, Object> getAttributes() {
        return extraAttributes;
    }
}
