package com.sports.kickauction.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(request);
        Map<String, Object> attributes = oauth2User.getAttributes();

         // 주석: 1) 카카오, 구글 둘 중 어떤 소셜 가입인지 확인하는 과정
        String registrationId = request.getClientRegistration().getRegistrationId(); 

        System.out.println("소셜 로그인 진입, registrationId = " + request.getClientRegistration().getRegistrationId());
        
        // 주석: 2) 사용자 정보 파싱
        final String finalEmail;
        final String finalNicknameBase;

        if ("google".equals(registrationId)) {
            finalEmail = (String) attributes.get("email");
            finalNicknameBase = (String) attributes.get("name");
        } else if ("kakao".equals(registrationId)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            finalEmail = (String) kakaoAccount.get("email");
            finalNicknameBase = (String) profile.get("nickname");
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        // 주석: 네임 중복 방지 
        String tempNickname = finalNicknameBase;
        int count = 1;
        while (memberRepository.existsByUserName(tempNickname)) {
            tempNickname = finalNicknameBase + count;
            count++;
        }
        final String finalNickname = tempNickname;


        // 주석: 가입 확인
        Member member = memberRepository.findByUserId(finalEmail)
            .orElseGet(() -> {
                // 주석: 미가입시 회원가입
                Member newMember = Member.builder()
                    .userId(finalEmail)
                    .userPw("10101t4udsvxchcv4%#$")
                    .userName(finalNickname)
                    .social(0) // 주석:0 =소셜
                    .role("USER")
                    .build();
                return memberRepository.save(newMember);
            });

        String userNameAttributeName = request
        .getClientRegistration()
        .getProviderDetails()
        .getUserInfoEndpoint()
        .getUserNameAttributeName();

        Map<String, Object> customAttributes = new HashMap<>(attributes);
        customAttributes.put("user_name", member.getUserName()); 

        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority(member.getRole())),
            attributes,
            userNameAttributeName
        );
    }   
}