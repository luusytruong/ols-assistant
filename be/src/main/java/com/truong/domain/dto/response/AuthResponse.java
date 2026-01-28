package com.truong.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder
public record AuthResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("refresh_token") String refreshToken) {

    public static AuthResponse of(String accessToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}
