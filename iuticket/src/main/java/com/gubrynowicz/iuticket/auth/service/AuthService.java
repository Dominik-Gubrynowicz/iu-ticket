 package com.gubrynowicz.iuticket.auth.service;

import com.gubrynowicz.iuticket.auth.dto.AuthOidcRequestDTO;
import com.gubrynowicz.iuticket.auth.dto.AuthOidcResponseDTO;
import com.gubrynowicz.iuticket.auth.dto.AuthValidateResponseDTO;
import com.gubrynowicz.iuticket.auth.model.AuthSessionToken;
import com.gubrynowicz.iuticket.auth.repository.AuthSessionTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;

 @Service
public class AuthService {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Autowired
    private AuthSessionTokenRepository authSessionTokenRepository;

     @Autowired
     public AuthService(
             AuthSessionTokenRepository authSessionTokenRepository) {
         this.authSessionTokenRepository = authSessionTokenRepository;
     }

    public Optional<AuthOidcResponseDTO> exhangeCodeWithGoogle(AuthOidcRequestDTO request) {
        ClientRegistration googleRegistration = clientRegistrationRepository.findByRegistrationId("google");
        RestTemplate restTemplate = new RestTemplate();

        String decodedCode = java.net.URLDecoder.decode(request.getCode(), StandardCharsets.UTF_8);

        MultiValueMap<String, String> formParams = new LinkedMultiValueMap<>();
        formParams.add("grant_type", "authorization_code");
        formParams.add("client_id", googleRegistration.getClientId());
        formParams.add("client_secret", googleRegistration.getClientSecret());
        formParams.add("code", decodedCode);  // Use decoded code
        formParams.add("redirect_uri", request.getRedirectUri());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(formParams, headers);
        try {
            ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.exchange(
                    googleRegistration.getProviderDetails().getTokenUri(),
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            String idToken = Objects.requireNonNull(tokenResponse.getBody()).get("id_token").toString();
            Integer expiresIn = (Integer) Objects.requireNonNull(tokenResponse.getBody()).get("expires_in");

            AuthSessionToken sessionTokenEntity = new AuthSessionToken();
            sessionTokenEntity.setToken(idToken);
            sessionTokenEntity.setExpirationDate(new java.util.Date(System.currentTimeMillis() + expiresIn * 1000));
            authSessionTokenRepository.save(sessionTokenEntity);

            return Optional.of(new AuthOidcResponseDTO(idToken));
        } catch (HttpClientErrorException e) {
            System.err.println("Google API Error: " + e.getResponseBodyAsString());
            return Optional.empty();
        }
    }

    public Optional<AuthValidateResponseDTO> validateToken() {
        try {
            getCurrentUserEmail();
            return Optional.of(new AuthValidateResponseDTO(true));
        }
        catch (AccessDeniedException e) {
            return Optional.empty();
        }
    }

    public String getCurrentUserEmail() throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = ((Jwt) authentication.getPrincipal()).getTokenValue();

        if (checkIfTokenIsValid(token)) {
            return ((Jwt) authentication.getPrincipal()).getClaim("email");
        } else {
            throw new AccessDeniedException("Invalid token");
        }
    }

    public String getCurrentUserName() throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = ((Jwt) authentication.getPrincipal()).getTokenValue();

        if (checkIfTokenIsValid(token)) {
            return ((Jwt) authentication.getPrincipal()).getClaim("name");
        } else {
            throw new AccessDeniedException("Invalid token");
        }
    }

    public Boolean checkIfTokenIsValid(String token) {
        AuthSessionToken sessionToken = authSessionTokenRepository.getByToken(token);
        return sessionToken != null && sessionToken.getExpirationDate().after(new Date());
    }
}