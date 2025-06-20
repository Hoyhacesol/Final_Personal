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

    @PostConstruct
    public void init() throws IOException {
        Path defaultDir = Paths.get(uploadPath, "default");
        if (!Files.exists(defaultDir)) {
            Files.createDirectories(defaultDir);
        }

        Path target = defaultDir.resolve(DEFAULT_IMAGE_NAME);
        if (!Files.exists(target)) {
            ClassPathResource resource = new ClassPathResource("static/" + DEFAULT_IMAGE_NAME);
            Files.copy(resource.getInputStream(), target);
            System.out.println("[기본 이미지] default.jpg 복사 완료");
        } else {
            System.out.println("[기본 이미지] 이미 존재함");
        }
    }
}
