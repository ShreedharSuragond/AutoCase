package com.example.autocase.auth;

import com.example.autocase.user.Permission;
import com.example.autocase.user.Role;
import com.example.autocase.user.RoleRepository;
import com.example.autocase.user.User;
import com.example.autocase.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public UserDto register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists");
        }

        String roleName = request.getRole() != null && !request.getRole().isBlank()
                ? request.getRole()
                : "ROLE_DEVELOPER_QA";

        Role assignedRole = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("ROLE_DEVELOPER_QA")
                        .orElseThrow(() -> new IllegalStateException("Default role not initialized")));

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .team(request.getTeam() != null && !request.getTeam().isBlank() ? request.getTeam().trim() : "QA Automation Core")
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(assignedRole)))
                .lastLoginAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        ResponseCookie cookie = tokenProvider.generateJwtCookie(jwt);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return toDto(saved);
    }

    @Transactional
    public UserDto login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        ResponseCookie cookie = tokenProvider.generateJwtCookie(jwt);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return toDto(user);
    }

    public void logout(HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        ResponseCookie cleanCookie = tokenProvider.getCleanJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cleanCookie.toString());
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toDto(user);
    }

    @Transactional(readOnly = true)
    public Set<String> getCurrentUserPermissions(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .collect(Collectors.toSet());
    }

    public UserDto toDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        Set<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .team(user.getTeam())
                .status(user.getStatus())
                .roles(roles)
                .permissions(permissions)
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
