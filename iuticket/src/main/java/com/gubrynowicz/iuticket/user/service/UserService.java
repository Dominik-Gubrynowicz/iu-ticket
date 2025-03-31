package com.gubrynowicz.iuticket.user.service;

import com.gubrynowicz.iuticket.auth.service.AuthService;
import com.gubrynowicz.iuticket.user.dto.UserDTO;
import com.gubrynowicz.iuticket.user.dto.UserConfigDTO;
import com.gubrynowicz.iuticket.user.model.User;
import com.gubrynowicz.iuticket.user.model.UserConfig;
import com.gubrynowicz.iuticket.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public Optional<UserDTO> getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (!hasAccessToUser(id)) {
            throw new AccessDeniedException("You don't have access to this resource");
        }

        if (user == null) {
            return Optional.empty();
        }

        return Optional.of(mapUserToUserDTO(user));
    }

    public UserDTO getCurrentUser() {
        String email = authService.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found with email: " + email));
        return mapUserToUserDTO(user);
    }

    public User getCurrentUserEntity() {
        String email = authService.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found with email: " + email));
    }

    public boolean hasAccessToUser(Long userId) {
        UserDTO currentUser = getCurrentUser();
        return userRepository.findById(userId)
                .map(user -> user.getId().equals(currentUser.getId()))
                .orElse(false);
    }

    public UserDTO createUser() {
        String username = authService.getCurrentUserName();
        String email = authService.getCurrentUserEmail();

        // Configure default user limits
        final int DEFAULT_TODO_LIMIT = 5;
        final int DEFAULT_IN_PROGRESS_LIMIT = 1;

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(username);

        UserConfig userConfig = new UserConfig();
        userConfig.setTodoWipLimit(DEFAULT_TODO_LIMIT);
        userConfig.setInProgressWipLimit(DEFAULT_IN_PROGRESS_LIMIT);
        newUser.setUserConfig(userConfig);
        User savedUser = userRepository.save(newUser);
        return mapUserToUserDTO(savedUser);
    }

    public UserDTO updateUser(Long id, UserDTO userDto) {
        if (!hasAccessToUser(id)) {
            throw new AccessDeniedException("You don't have access to this resource");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update user fields if provided
        if (userDto.getUsername() != null) {
            user.setUsername(userDto.getUsername());
        }

        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }

        // Update user config if provided
        if (userDto.getUserConfig() != null) {
            updateUserConfig(user, userDto.getUserConfig());
        }

        User updatedUser = userRepository.save(user);
        return mapUserToUserDTO(updatedUser);
    }

    private void updateUserConfig(User user, UserConfigDTO configDto) {
        UserConfig config = user.getUserConfig();

        if (config == null) {
            config = new UserConfig();
            user.setUserConfig(config);
        }

        if (configDto.getTodoWipLimit() != null) {
            config.setTodoWipLimit(configDto.getTodoWipLimit());
        }

        if (configDto.getInProgressWipLimit() != null) {
            config.setInProgressWipLimit(configDto.getInProgressWipLimit());
        }
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        if (!hasAccessToUser(id)) {
            throw new AccessDeniedException("You don't have access to this resource");
        }
        userRepository.deleteById(id);
    }

    private UserDTO mapUserToUserDTO(User user) {
        UserConfigDTO configDTO = null;
        if (user.getUserConfig() != null) {
            configDTO = new UserConfigDTO(
                    user.getUserConfig().getTodoWipLimit(),
                    user.getUserConfig().getInProgressWipLimit()
            );
        }

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                configDTO
        );
    }
}