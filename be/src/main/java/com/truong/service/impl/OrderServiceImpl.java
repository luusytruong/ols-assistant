package com.truong.service.impl;

import com.truong.domain.dto.request.OrderRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.OrderResponse;
import com.truong.domain.entity.Order;
import com.truong.domain.entity.OrderItem;
import com.truong.domain.entity.OrderStatus;
import com.truong.domain.entity.Product;
import com.truong.exception.ResourceNotFoundException;
import com.truong.mapper.OrderMapper;
import com.truong.repository.OrderRepository;
import com.truong.repository.ProductRepository;
import com.truong.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ApiResponse<OrderResponse> createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCode(generateOrderCode());
        order.setCustomerName(request.customerName());
        order.setCustomerPhone(request.customerPhone());
        order.setCustomerAddress(request.customerAddress());
        order.setCustomerEmail(request.customerEmail());
        order.setNote(request.note());
        order.setStatus(OrderStatus.PENDING);
        // Timestamps are handled by JPA @PrePersist

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        if (request.items() != null && !request.items().isEmpty()) {
            for (OrderRequest.OrderItemRequest itemRequest : request.items()) {
                Product product = productRepository.findById(itemRequest.productId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Không tìm thấy sản phẩm với id: " + itemRequest.productId()));

                if (product.getStock() < itemRequest.quantity()) {
                    throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng tồn kho");
                }

                // Deduct stock
                product.setStock(product.getStock() - itemRequest.quantity());
                productRepository.save(product);

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemRequest.quantity());
                orderItem.setPrice(product.getPrice());

                orderItems.add(orderItem);
                totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            }
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);
        return ApiResponse.success(orderMapper.toResponse(savedOrder));
    }

    @Override
    public ApiResponse<OrderResponse> getOrderById(Integer id) {
        OrderResponse response = orderRepository.findById(id)
                .map(orderMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
        return ApiResponse.success(response);
    }

    @Override
    public ApiResponse<OrderResponse> getOrderByCode(String code) {
        OrderResponse response = orderRepository.findByCode(code)
                .map(orderMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
        return ApiResponse.success(response);
    }

    @Override
    public ApiResponse<List<OrderResponse>> getOrderByPhone(String phone) {
        List<OrderResponse> orders = orderRepository.findByCustomerPhone(phone).stream()
                .map(orderMapper::toResponse).toList();
        return ApiResponse.success(orders);
    }

    @Override
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderRepository.findAll().stream()
                .map(orderMapper::toResponse).toList();
        return ApiResponse.success(orders);
    }

    @Override
    @Transactional
    public ApiResponse<OrderResponse> updateOrder(Integer id, OrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        order.setCustomerName(request.customerName());
        order.setCustomerPhone(request.customerPhone());
        order.setCustomerAddress(request.customerAddress());
        order.setCustomerEmail(request.customerEmail());
        order.setNote(request.note());

        // Note: Not updating items here for simplicity unless required.
        // Updating items would require complex logic (restoring stock, etc.)

        Order updatedOrder = orderRepository.save(order);
        return ApiResponse.success(orderMapper.toResponse(updatedOrder));
    }

    @Override
    @Transactional
    public ApiResponse<OrderResponse> patchOrder(Integer id, Map<String, Object> updates) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "customerName" -> order.setCustomerName((String) value);
                case "customerPhone" -> order.setCustomerPhone((String) value);
                case "customerAddress" -> order.setCustomerAddress((String) value);
                case "customerEmail" -> order.setCustomerEmail((String) value);
                case "note" -> order.setNote((String) value);
                case "status" -> order.setStatus(OrderStatus.valueOf((String) value));
                // Add other fields as needed
            }
        });

        Order patchedOrder = orderRepository.save(order);
        return ApiResponse.success(orderMapper.toResponse(patchedOrder));
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteOrder(Integer id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy đơn hàng");
        }
        orderRepository.deleteById(id);
        return ApiResponse.success(null);
    }

    private String generateOrderCode() {
        return "CT" + System.currentTimeMillis();
    }
}
