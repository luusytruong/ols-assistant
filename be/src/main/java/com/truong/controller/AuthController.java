package com.truong.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.truong.domain.dto.request.LoginRequest;
import com.truong.domain.dto.request.UserRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.UserResponse;
import com.truong.service.AuthService;
import com.truong.service.CookieService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> register(@Valid @RequestBody UserRequest request, HttpServletResponse response) {
        ApiResponse<Void> apiResponse = authService.register(request);
        cookieService.setAccessTokenCookie(response, apiResponse.authResponse().accessToken());
        cookieService.setRefreshTokenCookie(response, apiResponse.authResponse().refreshToken());
        return apiResponse;
    }

    @PostMapping("/login")
    public ApiResponse<Void> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        ApiResponse<Void> apiResponse = authService.login(request);
        cookieService.setAccessTokenCookie(response, apiResponse.authResponse().accessToken());
        cookieService.setRefreshTokenCookie(response, apiResponse.authResponse().refreshToken());
        return apiResponse;
    }

    @PostMapping("/refresh")
    public ApiResponse<Void> refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        ApiResponse<Void> apiResponse = authService.refreshToken(refreshToken);
        cookieService.setAccessTokenCookie(response, apiResponse.authResponse().accessToken());
        return apiResponse;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> profile() {
        return authService.profile();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        cookieService.deleteAllAuthCookies(response);
        return ApiResponse.success("Đăng xuất thành công");
    }
}
