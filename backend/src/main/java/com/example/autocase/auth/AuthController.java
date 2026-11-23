package com.example.autocase.auth;

import com.example.autocase.common.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        try {
            UserDto userDto = authService.register(request, response);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(userDto, "Account successfully registered"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<UserDto>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        try {
            UserDto userDto = authService.login(request, response);
            return ResponseEntity.ok(ApiResponse.ok(userDto, "Login successful"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out", "Session ended successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        UserDto userDto = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }

    @GetMapping("/me/permissions")
    public ResponseEntity<ApiResponse<Set<String>>> getCurrentUserPermissions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        Set<String> permissions = authService.getCurrentUserPermissions(principal);
        return ResponseEntity.ok(ApiResponse.ok(permissions));
    }
}
