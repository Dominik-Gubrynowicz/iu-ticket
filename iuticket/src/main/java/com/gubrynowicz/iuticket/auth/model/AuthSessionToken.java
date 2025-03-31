package com.gubrynowicz.iuticket.auth.model;

import com.gubrynowicz.iuticket.user.model.User;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class AuthSessionToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2048)
    private String token;

    private Date expirationDate;

    public AuthSessionToken() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }
    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
}
