package com.truong.mapper;

import com.truong.domain.dto.response.ProductResponse;
import com.truong.domain.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
}