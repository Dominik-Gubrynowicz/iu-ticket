package com.gubrynowicz.iuticket.service;

import com.gubrynowicz.iuticket.dto.UserDTO;
import com.gubrynowicz.iuticket.dto.UserConfigDTO;
import com.gubrynowicz.iuticket.model.User;
import com.gubrynowicz.iuticket.model.UserConfig;
import com.gubrynowicz.iuticket.repository.UserRepository;
import org.apache.tomcat.util.http.parser.Authorization;
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

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUserEntity(Authentication authentication) {
        return getUser(authentication)
                .orElseThrow(() -> new AccessDeniedException("Not authenticated"));
    }

    private Optional<User> getUser(Authentication authentication) {
        String email = extractEmail(authentication);
        return userRepository.findByEmail(email);
    }

    private String extractEmail(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OidcUser) {
            return ((OidcUser) authentication.getPrincipal()).getEmail();
        } else if (authentication.getPrincipal() instanceof Jwt) {
            return ((Jwt) authentication.getPrincipal()).getClaim("email");
        } else {
            throw new AccessDeniedException("Unsupported authentication type");
        }
    }

    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = getCurrentUserEntity(authentication);
        return mapUserToUserDTO(user);
    }

    public boolean hasAccessToUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = getCurrentUserEntity(authentication);
        return userRepository.findById(userId)
                .map(user -> user.getId().equals(currentUser.getId()))
                .orElse(false);
    }

    public UserDTO createUser() {
        String email;
        String username;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
            username = oidcUser.getFullName();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            email = jwt.getClaim("email");
            username = jwt.getClaim("name");
        } else {
            throw new AccessDeniedException("Unsupported authentication type");
        }

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