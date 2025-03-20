package com.gubrynowicz.iuticket.controller;

import com.gubrynowicz.iuticket.dto.UserDTO;
import com.gubrynowicz.iuticket.service.UserService;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            if (!userService.hasAccessToUser(id)) {
                throw new AccessDeniedException("You don't have access to this resource");
            }
            return ResponseEntity.ok(userService.getCurrentUser());
        }
        catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            if (!userService.hasAccessToUser(id)) {
                throw new AccessDeniedException("You don't have access to this resource");
            }
            userService.deleteUser(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            if (!userService.hasAccessToUser(id)) {
                throw new AccessDeniedException("You don't have access to this resource");
            }
            return ResponseEntity.ok(userService.updateUser(id, userDTO));
        }
        catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
