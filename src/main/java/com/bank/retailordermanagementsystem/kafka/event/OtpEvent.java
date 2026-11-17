package com.bank.retailordermanagementsystem.kafka.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class OtpEvent extends BaseKafkaEvent {
    private String channel; // MOBILE or EMAIL
    private String recipient;
    private String action; // REQUESTED or VERIFIED
}
