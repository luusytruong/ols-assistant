package com.truong.service;

import com.truong.domain.dto.request.OrderRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    ApiResponse<OrderResponse> createOrder(OrderRequest request);

    ApiResponse<OrderResponse> getOrderById(Integer id);

    ApiResponse<OrderResponse> getOrderByCode(String code);

    ApiResponse<List<OrderResponse>> getOrderByPhone(String phone);

    ApiResponse<List<OrderResponse>> getAllOrders();

    ApiResponse<OrderResponse> updateOrder(Integer id, OrderRequest request);

    ApiResponse<OrderResponse> patchOrder(Integer id, Map<String, Object> updates);

    ApiResponse<Void> deleteOrder(Integer id);
}
