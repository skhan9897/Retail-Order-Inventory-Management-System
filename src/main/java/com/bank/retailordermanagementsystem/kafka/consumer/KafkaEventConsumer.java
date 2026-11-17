package com.bank.retailordermanagementsystem.kafka.consumer;

import com.bank.retailordermanagementsystem.entity.NotificationLog;
import com.bank.retailordermanagementsystem.kafka.event.*;
import com.bank.retailordermanagementsystem.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaEventConsumer {

    private final NotificationLogRepository notificationLogRepository;

    @KafkaListener(topics = "${kafka.topic.retail-order-events}", groupId = "retail-order-group")
    public void consumeOrderEvent(OrderEvent event) {
        log.info("Received OrderEvent for OrderId [{}], Status [{}]", event.getOrderId(), event.getOrderStatus());
        NotificationLog notification = NotificationLog.builder()
                .recipient("user-" + event.getUserId())
                .channel(NotificationLog.Channel.KAFKA_EVENT)
                .messageContent("Order created successfully. Total: $" + event.getTotalAmount())
                .status(NotificationLog.DeliveryStatus.SENT)
                .providerResponseId("kafka-" + event.getEventId())
                .build();
        notificationLogRepository.save(notification);
    }

    @KafkaListener(topics = "${kafka.topic.mobile-otp-events}", groupId = "retail-order-group")
    public void consumeMobileOtpEvent(OtpEvent event) {
        log.info("Received Mobile OtpEvent for Recipient [{}], Action [{}]", event.getRecipient(), event.getAction());
    }

    @KafkaListener(topics = "${kafka.topic.email-otp-events}", groupId = "retail-order-group")
    public void consumeEmailOtpEvent(OtpEvent event) {
        log.info("Received Email OtpEvent for Recipient [{}], Action [{}]", event.getRecipient(), event.getAction());
    }

    @KafkaListener(topics = "${kafka.topic.verification-events}", groupId = "retail-order-group")
    public void consumeVerificationEvent(VerificationEvent event) {
        log.info("Received VerificationEvent for User [{}], Type [{}], Status [{}]",
                event.getUserId(), event.getVerificationType(), event.getStatus());
    }

    @KafkaListener(topics = "${kafka.topic.notification-events}", groupId = "retail-order-group")
    public void consumeNotificationEvent(NotificationEvent event) {
        log.info("Received NotificationEvent for Recipient [{}], Channel [{}]", event.getRecipient(), event.getChannel());
    }
}
