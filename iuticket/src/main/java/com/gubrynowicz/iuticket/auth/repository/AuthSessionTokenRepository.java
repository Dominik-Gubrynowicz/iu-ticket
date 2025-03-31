package com.gubrynowicz.iuticket.auth.repository;

import com.gubrynowicz.iuticket.auth.model.AuthSessionToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthSessionTokenRepository extends JpaRepository<AuthSessionToken, Long> {
    AuthSessionToken getByToken(String token);
}