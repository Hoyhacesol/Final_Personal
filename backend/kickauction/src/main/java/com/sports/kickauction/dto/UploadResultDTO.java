package com.sports.kickauction.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadResultDTO {
    private String uuid;
    private String fileName;
    private String folderPath;

    public String getImageURL() {
        return folderPath + "/" + uuid + "_" + fileName;
    }
}
