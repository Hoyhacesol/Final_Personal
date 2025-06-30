package com.sports.kickauction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.sports.kickauction.controller.advice.ViewCountInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final ViewCountInterceptor viewCountInterceptor;

    public WebConfig(ViewCountInterceptor viewCountInterceptor) {
        this.viewCountInterceptor = viewCountInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(viewCountInterceptor)
                .addPathPatterns("/api/community/*");
    }
}