package com.bank.retailordermanagementsystem.kafka.event;

import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent extends BaseKafkaEvent {
    private String orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String paymentMethod;
}
