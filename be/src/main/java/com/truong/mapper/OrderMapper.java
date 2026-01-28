package com.truong.mapper;

import com.truong.domain.dto.response.OrderItemResponse;
import com.truong.domain.dto.response.OrderResponse;
import com.truong.domain.entity.Order;
import com.truong.domain.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productImage", source = "product.image")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}