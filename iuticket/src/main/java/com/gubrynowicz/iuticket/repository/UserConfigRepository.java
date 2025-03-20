package com.gubrynowicz.iuticket.repository;

import com.gubrynowicz.iuticket.model.UserConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserConfigRepository extends JpaRepository<UserConfig, Long> {
}