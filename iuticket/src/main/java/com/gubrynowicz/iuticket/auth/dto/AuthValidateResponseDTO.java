package com.gubrynowicz.iuticket.auth.dto;

public class AuthValidateResponseDTO {
    private final boolean valid;

    public AuthValidateResponseDTO(boolean valid) {
        this.valid = valid;
    }

    // Getters and setters
    public boolean isValid() {
        return valid;
    }
}