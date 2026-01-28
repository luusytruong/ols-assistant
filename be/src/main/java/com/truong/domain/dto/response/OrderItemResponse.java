package com.truong.domain.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        Integer id,
        Integer productId,
        String productName,
        String productImage,
        Integer quantity,
        BigDecimal price) {
}
