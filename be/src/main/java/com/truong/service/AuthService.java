package com.truong.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import com.truong.domain.dto.request.LoginRequest;
import com.truong.domain.dto.request.UserRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.AuthResponse;
import com.truong.domain.dto.response.UserResponse;
import com.truong.mapper.UserMapper;
import com.truong.exception.InvalidCredentialsException;
import com.truong.exception.InvalidTokenException;
import com.truong.exception.ResourceNotFoundException;
import com.truong.domain.entity.User;
import com.truong.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtDecoder jwtDecoder;

    public ApiResponse<Void> register(UserRequest request) {
        ApiResponse<UserResponse> userResponse = userService.createUser(request);
        UserResponse user = userResponse.data();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.email(),
                request.password());

        String accessToken = tokenService.generateAccessToken(authentication);
        String refreshToken = tokenService.generateRefreshToken(user.email());

        AuthResponse authResponse = new AuthResponse(
                accessToken,
                refreshToken);

        return ApiResponse.success("Đăng ký thành công", authResponse);
    }

    public ApiResponse<Void> login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()));

            String accessToken = tokenService.generateAccessToken(authentication);
            String refreshToken = tokenService.generateRefreshToken(request.email());

            AuthResponse authResponse = new AuthResponse(
                    accessToken,
                    refreshToken);

            return ApiResponse.success("Đăng nhập thành công", authResponse);
        } catch (Exception e) {
            throw new InvalidCredentialsException("Email hoặc mật khẩu không đúng");
        }
    }

    public ApiResponse<UserResponse> profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserResponse user = userRepository.findByEmail(email)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        return ApiResponse.success("Lấy thông tin người dùng thành công", user);
    }

    public ApiResponse<Void> refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidTokenException("Refresh token không tồn tại");
        }

        try {
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String email = jwt.getSubject();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

            String newAccessToken = tokenService.generateAccessToken(user.getEmail(), user.getRole().name());
            AuthResponse authResponse = new AuthResponse(newAccessToken, refreshToken);

            return ApiResponse.success("Refresh token thành công", authResponse);
        } catch (Exception e) {
            throw new InvalidTokenException("Refresh token không hợp lệ hoặc đã hết hạn", e);
        }
    }
}
