package com.gubrynowicz.iuticket.auth.dto;

public class AuthOidcResponseDTO {

    private final String idToken;

    public AuthOidcResponseDTO(String idToken) {
        this.idToken = idToken;
    }

    // Getters and setters
    public String getIdToken() {
        return idToken;
    }
}
