package com.truong.domain.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Tên sản phẩm không được để trống") String name,
        @NotBlank(message = "Ảnh sản phẩm không được để trống") String image,
        @NotBlank(message = "Giá sản phẩm không được để trống") BigDecimal price,
        String description,
        Integer stock) {
}
