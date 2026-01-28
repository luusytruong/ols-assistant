package com.truong.domain.dto.request;

public record SearchProductRequest(
        String keyword,
        Double minPrice,
        Double maxPrice) {
}
