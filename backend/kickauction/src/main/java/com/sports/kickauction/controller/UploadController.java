package com.sports.kickauction.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.UploadResultDTO;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping(value = "/uploadAjax", consumes = "multipart/form-data")
    public List<UploadResultDTO> upload(@RequestParam("files") MultipartFile[] files) {

        List<UploadResultDTO> resultList = new ArrayList<>();

        String folderPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        File uploadDir = new File(uploadPath, folderPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        for (MultipartFile file : files) {
        // 이미지인지 검사 (MIME 타입)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            continue; // 이미지가 아니면 무시
        }

            String uuid = UUID.randomUUID().toString();
            String originalName = file.getOriginalFilename();
            String saveName = uuid + "_" + originalName;

            Path savePath = Paths.get(uploadDir.getAbsolutePath(), saveName); 

            try {
                file.transferTo(savePath.toFile());

                resultList.add(UploadResultDTO.builder()
                        .uuid(uuid)
                        .fileName(originalName)
                        .folderPath(folderPath)
                        .build());

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return resultList;
    }

    @GetMapping("/display")
    public ResponseEntity<Resource> display(@RequestParam("file") String file) throws IOException {
    Path filePath = Paths.get(uploadPath, file); 

    Resource resource = new FileSystemResource(filePath);

    if (!resource.exists()) {
        return ResponseEntity.notFound().build();
    }

    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Type", Files.probeContentType(filePath));
    return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/removeFile", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<Boolean> removeFile(@RequestParam("fileName") String fileName) {
    try {
        String srcFileName = URLDecoder.decode(fileName, "UTF-8");
        File file = new File(uploadPath + File.separator + srcFileName);

        boolean result = file.delete();

        return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
        return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}



}

