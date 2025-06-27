package com.sports.kickauction.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;

import com.sports.kickauction.service.CustomOAuth2UserService;
import com.sports.kickauction.service.MemberDetailsService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MemberDetailsService memberDetailsService;
    private final CustomOAuth2UserService oAuth2UserService;

    // 주석: 비밀번호 암호화 BCryptPasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 주석: csrf & 권한없이 사용 가능한 페이지 목록 (csrf - 현재 비활성화임)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 서버 템플릿(Thymeleaf, JSP 등)은 <form> 안에 hidden input으로 CSRF 토큰을 넣어줌
                // 하지만 React 같은 SPA는 form을 안 쓰고 JS로 요청하므로, CSRF 토큰을 수동으로 받아야 함
                // .csrf(csrf -> csrf
                // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                // .cors(withDefaults())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // api/display/** 안넣으면 이미지 문제생길시 허용이안됨 */
                .authorizeHttpRequests(auth -> auth
                        // 1) 모든 옵션 요청 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2) public 하게 열어둘 엔드포인트 (모두 slash 로 시작!)
                        .requestMatchers(
                                "/",
                                "/presignup",
                                "/presignups",
                                "/signup",
                                "/signups",
                                "/login",
                                "/api/**",
                                "/images/**",
                                "/api/display/**",
                                "/api/members/**")

                        // SELLER만 가능한 API
                        // .requestMatchers("/api/seller/register", "/api/seller/register-info", "/api/seller/modify", "/api/seller/modify-info")
                        // .hasRole("SELLER")

                        // // 로그인만 하면 누구나 접근 가능한 API
                        // .requestMatchers("/api/seller/registered").authenticated()

                        // // 공개 API
                        // .requestMatchers("/api/seller/list", "/api/seller/detail").permitAll()

                        // 로그인한 사용자만 업로드·삭제 가능
                        //.requestMatchers("/api/uploadAjax", "/api/removeFile").authenticated()
                        .permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((req, res, auth) -> {
                            SecurityContextHolder.getContext().setAuthentication(auth); // 인증 세션 만들기
                            res.setStatus(HttpServletResponse.SC_OK);
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.getWriter().write("로그인 실패");
                        })
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(HttpServletResponse.SC_OK))
                        .permitAll())
                .oauth2Login(oauth -> oauth
                        .loginPage("/login")
                        .userInfoEndpoint(user -> user.userService(oAuth2UserService))
                        .successHandler((request, response, authentication) -> {
                            response.sendRedirect("http://localhost:3000/socialgowhere");
                        }));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 프론트 개발 서버 주소
        // setAllowedOrigins(...) 대신 → setAllowedOriginPatterns(...) 사용함
        // 이유: setAllowCredentials(true)와 함께 사용할 수 있기 때문
        config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
        // 허용 HTTP 메서드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // 허용 헤더
        config.setAllowedHeaders(List.of("*"));
        // 쿠키 전송 허용하려면 true
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 /api/** 경로에 위 정책 적용
        source.registerCorsConfiguration("/**", config);
        source.registerCorsConfiguration("/images/**", config);
        return source;
    }

    // 주석: 비밀번호 암호화 인코더
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(memberDetailsService).passwordEncoder(passwordEncoder());
        return builder.build();
    }
}