package com.bank.retailordermanagementsystem.service;

import com.bank.retailordermanagementsystem.dto.OrderRequest;
import com.bank.retailordermanagementsystem.dto.OrderResponse;
import com.bank.retailordermanagementsystem.entity.OrderEntity;
import com.bank.retailordermanagementsystem.entity.OrderItemEntity;
import com.bank.retailordermanagementsystem.entity.OutboxEvent;
import com.bank.retailordermanagementsystem.kafka.event.OrderEvent;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.repository.OrderRepository;
import com.bank.retailordermanagementsystem.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final KafkaEventProducer kafkaEventProducer;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        log.info("Creating order for User [{}] Total Amount [{}]", request.getUserId(), request.getTotalAmount());

        String generatedOrderId = "ORD-" + System.currentTimeMillis();

        List<OrderItemEntity> items = request.getItems().stream()
                .map(it -> OrderItemEntity.builder()
                        .productId(it.getProductId())
                        .productName(it.getProductName())
                        .price(it.getPrice())
                        .quantity(it.getQuantity())
                        .image(it.getImage())
                        .build())
                .collect(Collectors.toList());

        OrderEntity order = OrderEntity.builder()
                .orderId(generatedOrderId)
                .userId(request.getUserId())
                .totalAmount(request.getTotalAmount())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Credit Card")
                .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Default Address")
                .status(OrderEntity.OrderStatus.PENDING)
                .items(items)
                .build();

        OrderEntity savedOrder = orderRepository.save(order);

        // Transactional Outbox Pattern
        try {
            OrderEvent kafkaEvent = OrderEvent.builder()
                    .eventId("EVT-ORD-" + System.currentTimeMillis())
                    .eventType("ORDER_CREATED")
                    .orderId(savedOrder.getOrderId())
                    .userId(savedOrder.getUserId())
                    .totalAmount(savedOrder.getTotalAmount())
                    .orderStatus(savedOrder.getStatus().name())
                    .paymentMethod(savedOrder.getPaymentMethod())
                    .timestamp(LocalDateTime.now())
                    .build();

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("ORDER")
                    .aggregateId(savedOrder.getOrderId())
                    .eventType("ORDER_CREATED")
                    .topicName("retail-order-events")
                    .payload(objectMapper.writeValueAsString(kafkaEvent))
                    .processed(false)
                    .build();

            outboxEventRepository.save(outboxEvent);

            // Directly dispatch via Kafka Producer
            kafkaEventProducer.sendOrderEvent(kafkaEvent);
        } catch (Exception e) {
            log.error("Failed to write to Outbox or publish Kafka Event: {}", e.getMessage());
        }

        return OrderResponse.builder()
                .orderId(savedOrder.getOrderId())
                .userId(savedOrder.getUserId())
                .totalAmount(savedOrder.getTotalAmount())
                .status(savedOrder.getStatus().name())
                .paymentMethod(savedOrder.getPaymentMethod())
                .shippingAddress(savedOrder.getShippingAddress())
                .items(request.getItems())
                .createdAt(savedOrder.getCreatedAt())
                .build();
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<OrderEntity> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().map(ord -> OrderResponse.builder()
                .orderId(ord.getOrderId())
                .userId(ord.getUserId())
                .totalAmount(ord.getTotalAmount())
                .status(ord.getStatus().name())
                .paymentMethod(ord.getPaymentMethod())
                .shippingAddress(ord.getShippingAddress())
                .createdAt(ord.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
