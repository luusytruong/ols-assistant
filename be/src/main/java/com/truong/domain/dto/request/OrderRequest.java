package com.truong.domain.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record OrderRequest(

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(
                regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
                message = "Số điện thoại không hợp lệ (VN)"
        )
        String customerPhone,

        @NotBlank(message = "Địa chỉ không được để trống")
        String customerAddress,

        String note,

        @NotBlank(message = "Tên khách hàng không được để trống")
        String customerName,

        @Email(message = "Email không hợp lệ")
        String customerEmail,

        @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
        @Valid
        List<OrderItemRequest> items
) {

    public record OrderItemRequest(

            @NotNull(message = "Sản phẩm không được để trống")
            Integer productId,

            @NotNull(message = "Số lượng không được để trống")
            @Min(value = 1, message = "Số lượng phải lớn hơn 0")
            Integer quantity
    ) {
    }
}

