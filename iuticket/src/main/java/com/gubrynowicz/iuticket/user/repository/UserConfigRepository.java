package com.gubrynowicz.iuticket.user.repository;

import com.gubrynowicz.iuticket.user.model.UserConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserConfigRepository extends JpaRepository<UserConfig, Long> {
}