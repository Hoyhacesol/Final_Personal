package com.sports.kickauction.controller.advice;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.sports.kickauction.service.CommunityService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class ViewCountInterceptor implements HandlerInterceptor {
    private static final String SESSION_KEY = "VIEWED_POSTS";

    private final CommunityService communityService;

    public ViewCountInterceptor(CommunityService communityService) {
        this.communityService = communityService;
    }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
        // GET /api/community/{pno} 패턴만 처리
        if ("GET".equals(req.getMethod()) &&
                req.getRequestURI().matches("/api/community/\\d+")) {

            Long pno = Long.valueOf(req.getRequestURI().replaceAll("\\D+", ""));
            HttpSession session = req.getSession();
            @SuppressWarnings("unchecked")
            Set<Long> viewed = (Set<Long>) session.getAttribute(SESSION_KEY);
            if (viewed == null) {
                viewed = new HashSet<>();
            }

            // 아직 한 번도 안 봤으면 증가시키고 세션에 기록
            if (!viewed.contains(pno)) {
                communityService.incrementViewCount(pno);
                viewed.add(pno);
                session.setAttribute(SESSION_KEY, viewed);
            }
        }
        return true;
    }
}