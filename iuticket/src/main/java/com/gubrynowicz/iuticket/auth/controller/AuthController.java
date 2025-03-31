package com.gubrynowicz.iuticket.auth.controller;

import com.gubrynowicz.iuticket.auth.dto.AuthOidcRequestDTO;
import com.gubrynowicz.iuticket.auth.dto.AuthOidcResponseDTO;
import com.gubrynowicz.iuticket.auth.dto.AuthValidateResponseDTO;
import com.gubrynowicz.iuticket.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthOidcResponseDTO> exchangeGoogleCode(@RequestBody AuthOidcRequestDTO request) {
        try {
            Optional<AuthOidcResponseDTO> response = authService.exhangeCodeWithGoogle(request);
            return response.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(400).build());
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(500).body(new AuthOidcResponseDTO( "Error exchanging code"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthValidateResponseDTO> validateToken() {
        Optional<AuthValidateResponseDTO> response = authService.validateToken();
        return response.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}