package com.sports.kickauction.task;

import java.io.File;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;


import com.sports.kickauction.repository.SellerIntroRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class FileCheckTask {

    private final SellerIntroRepository sellerIntroRepository;

    private String getFolderYesterDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -1);
        return sdf.format(cal.getTime());
    }

    @Scheduled(cron = "0 0 3 * * *") // 매일 새벽 3시
    public void checkFiles() {

        // DB에 저장된 모든 simage 경로들
        List<String> dbPaths = sellerIntroRepository.findAllImagePaths();

        Set<String> imagePathSet = new HashSet<>();
        for (String pathGroup : dbPaths) {
            String[] paths = pathGroup.split(",");
            for (String path : paths) {
                    imagePathSet.add(path.trim());
            }
        }

        // 어제 날짜 기준 폴더
        File folder = Paths.get("C:/upload", getFolderYesterDay()).toFile();
        if (!folder.exists()) {
            log.info("어제 날짜 폴더 없음: {}", folder.getAbsolutePath());
            return;
        }

        File[] files = folder.listFiles();
        if (files == null) return;

        // 삭제 대상 파일: DB에 없는 파일만
        for (File file : files) {
            String relativePath = getRelativePath(file);
            if (!imagePathSet.contains(relativePath)) {
                log.warn("삭제 대상 파일: {}", relativePath);
                file.delete();
            }
        }
    }

    // 파일 경로를 upload 기준 상대 경로로 변환
    private String getRelativePath(File file) {
        String fullPath = file.getAbsolutePath().replace("\\", "/");
        int index = fullPath.indexOf("upload/");
        return fullPath.substring(index + 7); // "upload/" 이후부터
    }
}
