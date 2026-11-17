package com.bank.retailordermanagementsystem.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDto> items;

    private String paymentMethod;
    private String shippingAddress;

    @Data
    public static class OrderItemDto {
        private String productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private String image;
    }
}
