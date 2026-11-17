package com.bank.retailordermanagementsystem.kafka.producer;

import com.bank.retailordermanagementsystem.kafka.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.retail-order-events}")
    private String orderEventsTopic;

    @Value("${kafka.topic.mobile-otp-events}")
    private String mobileOtpEventsTopic;

    @Value("${kafka.topic.email-otp-events}")
    private String emailOtpEventsTopic;

    @Value("${kafka.topic.verification-events}")
    private String verificationEventsTopic;

    @Value("${kafka.topic.notification-events}")
    private String notificationEventsTopic;

    public void sendOrderEvent(OrderEvent event) {
        log.info("Publishing OrderEvent [{}] to topic [{}]", event.getOrderId(), orderEventsTopic);
        kafkaTemplate.send(orderEventsTopic, event.getOrderId(), event);
    }

    public void sendMobileOtpEvent(OtpEvent event) {
        log.info("Publishing Mobile OtpEvent for [{}] to topic [{}]", event.getRecipient(), mobileOtpEventsTopic);
        kafkaTemplate.send(mobileOtpEventsTopic, event.getRecipient(), event);
    }

    public void sendEmailOtpEvent(OtpEvent event) {
        log.info("Publishing Email OtpEvent for [{}] to topic [{}]", event.getRecipient(), emailOtpEventsTopic);
        kafkaTemplate.send(emailOtpEventsTopic, event.getRecipient(), event);
    }

    public void sendVerificationEvent(VerificationEvent event) {
        log.info("Publishing VerificationEvent for User [{}] type [{}] to topic [{}]", event.getUserId(), event.getVerificationType(), verificationEventsTopic);
        kafkaTemplate.send(verificationEventsTopic, String.valueOf(event.getUserId()), event);
    }

    public void sendNotificationEvent(NotificationEvent event) {
        log.info("Publishing NotificationEvent to [{}] channel [{}] to topic [{}]", event.getRecipient(), event.getChannel(), notificationEventsTopic);
        kafkaTemplate.send(notificationEventsTopic, event.getRecipient(), event);
    }
}
