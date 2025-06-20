package com.sports.kickauction.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnySetter;

import java.lang.Integer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {
    private int ono;
    private int mno;
    private String playType; // React: sport
    private String olocation; // React: region
    private LocalDateTime rentalDate; // React: datetime (날짜 부분)
    private String rentalTime; // React: datetime (시간 부분)
    private Integer person; // React: people
    private String rentalEquipment; // React: rentalItems, detail 합친 값
    private String ocontent; // React: request
    private LocalDateTime regdate;
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
