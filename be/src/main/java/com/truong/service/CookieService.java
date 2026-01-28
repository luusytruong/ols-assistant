package com.truong.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class CookieService {

    @Value("${jwt.secure:false}")
    private boolean secure;

    @Value("${jwt.access-expiration:900000}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpirationMs;

    private static final String ACCESS_TOKEN_NAME = "access_token";
    private static final String REFRESH_TOKEN_NAME = "refresh_token";

    public void setAccessTokenCookie(HttpServletResponse response, String token) {
        setCookie(response, token, ACCESS_TOKEN_NAME, accessExpirationMs / 1000);
    }

    public void setRefreshTokenCookie(HttpServletResponse response, String token) {
        setCookie(response, token, REFRESH_TOKEN_NAME, refreshExpirationMs / 1000);
    }

    public void deleteAccessTokenCookie(HttpServletResponse response) {
        deleteCookie(response, ACCESS_TOKEN_NAME);
    }

    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        deleteCookie(response, REFRESH_TOKEN_NAME);
    }

    public void deleteAllAuthCookies(HttpServletResponse response) {
        deleteAccessTokenCookie(response);
        deleteRefreshTokenCookie(response);
    }

    private void setCookie(HttpServletResponse response, String token, String name, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(name, token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
//                .domain("truong.cloud")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void deleteCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
