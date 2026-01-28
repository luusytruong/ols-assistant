package com.truong.domain.dto.response;

import com.truong.domain.entity.OrderStatus;

import java.math.BigDecimal;
import java.util.List;

public record OrderResponse(
        Integer id,
        String code,
        String note,
        String customerName,
        String customerPhone,
        String customerEmail,
        String customerAddress,
        BigDecimal totalPrice,
        OrderStatus status,
        List<OrderItemResponse> items) {
}
