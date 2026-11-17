package com.bank.retailordermanagementsystem.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseKafkaEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
}
