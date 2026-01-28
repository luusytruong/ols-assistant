package com.truong.controller;

import com.truong.domain.dto.request.OrderRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.OrderResponse;
import com.truong.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/code/{code}")
    public ApiResponse<OrderResponse> getOrderByCode(@PathVariable String code) {
        return orderService.getOrderByCode(code);
    }

    @GetMapping("/phone/{phone}")
    public ApiResponse<List<OrderResponse>> getOrderByPhone(@PathVariable String phone) {
        return orderService.getOrderByPhone(phone);
    }

    @PutMapping("/{id}")
    public ApiResponse<OrderResponse> updateOrder(@PathVariable Integer id, @Valid @RequestBody OrderRequest request) {
        return orderService.updateOrder(id, request);
    }

    @PatchMapping("/{id}")
    public ApiResponse<OrderResponse> patchOrder(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        return orderService.patchOrder(id, updates);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOrder(@PathVariable Integer id) {
        return orderService.deleteOrder(id);
    }
}
