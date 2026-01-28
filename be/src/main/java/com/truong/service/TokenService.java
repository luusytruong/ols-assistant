package com.truong.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtEncoder encoder;

    @Value("${jwt.access-expiration:3600000}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpirationMs;

    public String generateAccessToken(Authentication authentication) {
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        return generateAccessToken(authentication.getName(), scope);
    }

    public String generateAccessToken(String username, String scope) {
        return createToken(username, accessExpirationMs, Map.of("scope", scope));
    }

    public String generateRefreshToken(String username) {
        return createToken(username, refreshExpirationMs, Map.of());
    }

    private String createToken(String subject, long expirationMs, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(subject)
                .claims(map -> map.putAll(extraClaims))
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
