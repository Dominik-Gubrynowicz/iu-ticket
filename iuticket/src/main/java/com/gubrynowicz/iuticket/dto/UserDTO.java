package com.gubrynowicz.iuticket.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class UserDTO {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private final Long id;
    private String username;
    private String email;
    private UserConfigDTO userConfigDTO;

    public UserDTO(Long id, String username, String email, UserConfigDTO userConfigDTO) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.userConfigDTO = userConfigDTO;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public UserConfigDTO getUserConfig() {
        return userConfigDTO;
    }

    public void setUserConfig(UserConfigDTO userConfigDTO) {
        this.userConfigDTO = userConfigDTO;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }
}
