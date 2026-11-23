package com.example.autocase.auth;

import com.example.autocase.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String fullName;
    private final String status;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, String email, String password, String fullName, String status,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.status = status;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            if (role.getPermissions() != null) {
                role.getPermissions().forEach(permission ->
                        authorities.add(new SimpleGrantedAuthority(permission.getName()))
                );
            }
        });

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getFullName(),
                user.getStatus(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"LOCKED".equalsIgnoreCase(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equalsIgnoreCase(status);
    }
}
