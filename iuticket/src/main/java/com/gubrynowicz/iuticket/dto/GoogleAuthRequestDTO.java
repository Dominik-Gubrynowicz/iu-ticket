package com.gubrynowicz.iuticket.dto;

public class GoogleAuthRequestDTO {
    private String code;
    private String redirectUri;

    public GoogleAuthRequestDTO(String code, String redirectUri) {
        this.code = code;
        this.redirectUri = redirectUri;
    }

    // Getters and setters
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getRedirectUri() {
        return redirectUri;
    }
    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }
}
