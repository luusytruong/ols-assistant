package com.truong.service;

import com.truong.domain.dto.request.ProductRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.ProductResponse;

import java.util.List;
import java.util.Map;

public interface ProductService {
    ApiResponse<ProductResponse> createProduct(ProductRequest request);

    ApiResponse<List<ProductResponse>> searchProduct(String keyword, Double minPrice, Double maxPrice);

    ApiResponse<ProductResponse> getProductById(Integer id);

    ApiResponse<List<ProductResponse>> getAllProducts();

    ApiResponse<ProductResponse> updateProduct(Integer id, ProductRequest request);

    ApiResponse<ProductResponse> patchProduct(Integer id, Map<String, Object> updates);

    ApiResponse<Void> deleteProduct(Integer id);
}
