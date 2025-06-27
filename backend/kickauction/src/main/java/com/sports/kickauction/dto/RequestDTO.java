package com.sports.kickauction.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.lang.Integer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {
    private int ono;
    private int mno;

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
