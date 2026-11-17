package com.bank.retailordermanagementsystem.kafka.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent extends BaseKafkaEvent {
    private String recipient;
    private String channel;
    private String title;
    private String message;
}
