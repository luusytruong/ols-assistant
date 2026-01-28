package com.truong.domain.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.Builder;

@Builder
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        @JsonUnwrapped AuthResponse authResponse,
        List<String> errors) {

    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, AuthResponse authResponse) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .authResponse(authResponse)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(List<String> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .errors(errors)
                .build();
    }

    public static ApiResponse<Void> unauthorized() {
        return ApiResponse.<Void>builder()
                .success(false)
                .message("Bạn không có quyền truy cập. Vui lòng đăng nhập.")
                .build();
    }

    public static ApiResponse<Void> forbidden() {
        return ApiResponse.<Void>builder()
                .success(false)
                .message("Bạn không có quyền thực hiện hành động này.")
                .build();
    }
}
