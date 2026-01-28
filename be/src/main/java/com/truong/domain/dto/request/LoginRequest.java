package com.truong.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email không được bỏ trống") @Email(message = "Email không hợp lệ") String email,
        @NotBlank(message = "Mật khẩu không được bỏ trống") String password) {
}
