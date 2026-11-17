package com.bank.retailordermanagementsystem.kafka.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationEvent extends BaseKafkaEvent {
    private Long userId;
    private String verificationType; // AADHAAR, MOBILE, EMAIL
    private String status;
    private String transactionRefId;
}
