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
public class DummyProfileInitializer {

    @Value("${upload.path}")
    private String uploadPath;

    private final String PIC1 = "p01.jpg";
    private final String PIC2 = "p02.jpg";
    private final String PIC3 = "p03.png";
    private final String PIC4 = "p04.png";
    private final String PIC5 = "p05.png";
    private final String PIC6 = "p06.gif";
    private final String PIC7 = "p07.png";
    private final String PIC8 = "p08.png";
    private final String PIC9 = "p09.jpg";
    private final String PIC10 = "p10.gif";   
    private final String PIC11 = "p11.gif";  
    private final String PIC12 = "p12.jpg";  

    @PostConstruct
    public void init() throws IOException {

        Path pfDir = Paths.get(uploadPath);
        if (!Files.exists(pfDir)) {
            Files.createDirectories(pfDir);
        }

        copyIfNotExists(PIC1, pfDir);
        copyIfNotExists(PIC2, pfDir);
        copyIfNotExists(PIC3, pfDir);
        copyIfNotExists(PIC4, pfDir);
        copyIfNotExists(PIC5, pfDir);
        copyIfNotExists(PIC6, pfDir);
        copyIfNotExists(PIC7, pfDir);
        copyIfNotExists(PIC8, pfDir);
        copyIfNotExists(PIC9, pfDir);
        copyIfNotExists(PIC10, pfDir);
        copyIfNotExists(PIC11, pfDir);
        copyIfNotExists(PIC12, pfDir);
        
    }

        private void copyIfNotExists(String fileName, Path targetDir) throws IOException {
            Path target = targetDir.resolve(fileName);
            if (!Files.exists(target)) {
                ClassPathResource resource = new ClassPathResource("static/" + fileName);
                Files.copy(resource.getInputStream(), target);
            } else {
            }
        }
}
