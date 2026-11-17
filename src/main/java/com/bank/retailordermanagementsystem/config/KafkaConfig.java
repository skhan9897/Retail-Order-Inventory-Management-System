package com.bank.retailordermanagementsystem.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

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

    @Bean
    public NewTopic orderEventsTopic() {
        return TopicBuilder.name(orderEventsTopic).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic mobileOtpEventsTopic() {
        return TopicBuilder.name(mobileOtpEventsTopic).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic emailOtpEventsTopic() {
        return TopicBuilder.name(emailOtpEventsTopic).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic verificationEventsTopic() {
        return TopicBuilder.name(verificationEventsTopic).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic notificationEventsTopic() {
        return TopicBuilder.name(notificationEventsTopic).partitions(3).replicas(1).build();
    }

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> template) {
        // Retry 3 times with 1-second interval, then send to DLT (.DLT suffix)
        return new DefaultErrorHandler(
                new DeadLetterPublishingRecoverer(template),
                new FixedBackOff(1000L, 3L)
        );
    }
}
