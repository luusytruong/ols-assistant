package com.truong.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.truong.domain.dto.request.ProductRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.ProductResponse;
import com.truong.exception.ResourceNotFoundException;
import com.truong.mapper.ProductMapper;
import com.truong.repository.ProductRepository;
import com.truong.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Override
    public ApiResponse<ProductResponse> createProduct(ProductRequest request) {
        return null;
    }

    @Override
    public ApiResponse<List<ProductResponse>> searchProduct(String keyword, Double minPrice, Double maxPrice) {
        List<ProductResponse> products = productRepository.search(keyword, minPrice, maxPrice).stream()
                .map(productMapper::toResponse).toList();
        return ApiResponse.success(products);
    }

    @Override
    public ApiResponse<ProductResponse> getProductById(Integer id) {
        ProductResponse response = productRepository.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return ApiResponse.success(response);
    }

    @Override
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productRepository.findAll().stream().map(productMapper::toResponse).toList();
        return ApiResponse.success(products);
    }

    @Override
    public ApiResponse<ProductResponse> updateProduct(Integer id, ProductRequest request) {
        return null;
    }

    @Override
    public ApiResponse<ProductResponse> patchProduct(Integer id, Map<String, Object> updates) {
        return null;
    }

    @Override
    public ApiResponse<Void> deleteProduct(Integer id) {
        return null;
    }
}
