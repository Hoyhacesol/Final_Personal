package com.sports.kickauction.task;

import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.entity.Request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class RequestCleanupScheduler {

    private final RequestRepository requestRepository;

    @Scheduled(cron = "0 5 3 * * ?") 
    public void deleteExpiredCancelledOrders() {
        LocalDateTime now = LocalDateTime.now();
        List<Request> expired = requestRepository.findByFinishedAndOregdateBefore(2, now);
        if (!expired.isEmpty()) {
            requestRepository.deleteAll(expired); // deleteAll을 사용해야 Cascade가 정상 동작
            log.info("삭제된 만료 취소 견적 수: {}", expired.size());
        } else {
            log.info("삭제할 만료 취소 견적 없음.");
        }
    }
}
