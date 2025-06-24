package com.sports.kickauction.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;

@Component
@RequiredArgsConstructor
public class DefaultImageInitializer {

    @Value("${upload.path}")
    private String uploadPath;

    private final String DEFAULT_IMAGE_NAME = "default.png";
    private final String BASE_PROFILE_IMAGE_NAME = "baseprofile.png";

    @PostConstruct
    public void init() throws IOException {
        Path defaultDir = Paths.get(uploadPath, "default");
        if (!Files.exists(defaultDir)) {
            Files.createDirectories(defaultDir);
        }

        Path pfDir = Paths.get(uploadPath);
        if (!Files.exists(pfDir)) {
            Files.createDirectories(pfDir);
        }

        copyIfNotExists(DEFAULT_IMAGE_NAME, defaultDir);

        copyIfNotExists(BASE_PROFILE_IMAGE_NAME, pfDir);
        
    }

        private void copyIfNotExists(String fileName, Path targetDir) throws IOException {
            Path target = targetDir.resolve(fileName);
            if (!Files.exists(target)) {
                ClassPathResource resource = new ClassPathResource("static/" + fileName);
                Files.copy(resource.getInputStream(), target);
                System.out.println("[기본 이미지] " + fileName + " 복사 완료");
            } else {
                System.out.println("[기본 이미지] " + fileName + " 이미 존재함");
            }
        }
}
