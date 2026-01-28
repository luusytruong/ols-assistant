package com.truong.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserResponse(
        Integer id,
        @JsonProperty("full_name") String fullName,
        String email,
        String phone,
        String avatar,
        String city,
        String district,
        String ward,
        String address,
        String role) {
}
