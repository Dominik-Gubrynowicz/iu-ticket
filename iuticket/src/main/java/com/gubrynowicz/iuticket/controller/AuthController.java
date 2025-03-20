package com.gubrynowicz.iuticket.controller;

import com.gubrynowicz.iuticket.dto.GoogleAuthRequestDTO;
import com.gubrynowicz.iuticket.dto.TokenValidationDTO;
import com.gubrynowicz.iuticket.dto.UserDTO;
import com.gubrynowicz.iuticket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Autowired
    private UserService userService;


    @PostMapping("/google")
    public ResponseEntity<?> exchangeGoogleCode(@RequestBody GoogleAuthRequestDTO request) {
        try {
            ClientRegistration googleRegistration = clientRegistrationRepository.findByRegistrationId("google");
            RestTemplate restTemplate = new RestTemplate();

            // Try to decode the code if it's URL encoded
            String decodedCode = java.net.URLDecoder.decode(request.getCode(), StandardCharsets.UTF_8);

            // Log more detailed information
            System.out.println("Token URI: " + googleRegistration.getProviderDetails().getTokenUri());
            System.out.println("Redirect URI: " + request.getRedirectUri());

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

            // Use a more detailed exception handler
            try {
                ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.exchange(
                        googleRegistration.getProviderDetails().getTokenUri(),
                        HttpMethod.POST,
                        requestEntity,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
                return ResponseEntity.ok(tokenResponse.getBody());
            } catch (HttpClientErrorException e) {
                System.err.println("Google API Error: " + e.getResponseBodyAsString());
                return ResponseEntity
                        .status(e.getStatusCode())
                        .body(Map.of("error", e.getResponseBodyAsString()));
            }
        } catch (Exception e) {
            e.printStackTrace(); // More detailed logging
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<TokenValidationDTO> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            UserDTO currentUser = userService.getCurrentUser();

            TokenValidationDTO response = new TokenValidationDTO(
                    true,
                    "Token is valid",
                    currentUser
            );

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(new TokenValidationDTO(false, "Token is invalid", null));
    }

    @GetMapping("/login")
    public UserDTO login() {
        try {
            return userService.getCurrentUser();
        }
        catch (AccessDeniedException e) {
            return userService.createUser();
        }
    }
}