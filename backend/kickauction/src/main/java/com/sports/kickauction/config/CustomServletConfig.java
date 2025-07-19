package com.sports.kickauction.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import com.sports.kickauction.controller.formatter.LocalDateFormatter;

@Configuration
public class CustomServletConfig implements WebMvcConfigurer {

 /** application.properties 에 설정된 실제 업로드 경로 */
    @Value("${upload.path}")
    private String uploadDir;  // 예: C:/upload

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /images/** 로 들어오는 요청을 C:/upload 폴더로 매핑
      registry.addResourceHandler("/images/community/**")
                .addResourceLocations("file:" + uploadDir + "/community/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());

                 registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new LocalDateFormatter());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000","http://192.168.219.247:3000")
                .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(300)
                .allowedHeaders("Authorization", "Cache-Control", "Content-Type")
                .allowCredentials(true);
    }

}