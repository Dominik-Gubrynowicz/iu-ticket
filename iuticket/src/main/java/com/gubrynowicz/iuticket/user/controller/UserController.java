package com.gubrynowicz.iuticket.user.controller;

import com.gubrynowicz.iuticket.user.dto.UserDTO;
import com.gubrynowicz.iuticket.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id).orElseThrow());
        }
        catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/login")
    public ResponseEntity<UserDTO> login() {
        try {
            return ResponseEntity.ok(userService.getCurrentUser());
        }
        catch (AccessDeniedException e) {
            try {
                return ResponseEntity.ok(userService.createUser());
            }
            catch (AccessDeniedException e2) {
                return ResponseEntity.status(400).build();
            }
            catch (RuntimeException e2) {
                return ResponseEntity.notFound().build();
            }
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
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
