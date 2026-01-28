package com.truong.domain.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
        Integer id,
        String name,
        String image,
        BigDecimal price,
        String description,
        Integer stock,
        String weight,
        String discount) {
}
