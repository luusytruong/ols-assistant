package com.truong.controller;

import com.truong.domain.dto.request.SearchProductRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.ProductResponse;
import com.truong.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/search")
    public ApiResponse<List<ProductResponse>> searchProduct(@Valid @RequestBody(required = false) SearchProductRequest request) {
        return productService.searchProduct(request.keyword(), request.minPrice(), request.maxPrice());
    }
}
