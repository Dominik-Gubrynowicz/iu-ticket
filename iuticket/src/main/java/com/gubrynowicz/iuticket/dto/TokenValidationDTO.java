package com.gubrynowicz.iuticket.dto;

public class TokenValidationDTO {
    private boolean valid;
    private String message;
    private UserDTO user;

    public TokenValidationDTO(boolean valid, String message, UserDTO user) {
        this.valid = valid;
        this.message = message;
        this.user = user;
    }

    // Getters and setters
    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}