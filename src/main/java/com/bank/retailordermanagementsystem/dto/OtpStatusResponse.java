package com.bank.retailordermanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpStatusResponse {
    private String identifier; // email or phone
    private boolean verified;
    private boolean cooldownActive;
    private long cooldownRemainingSeconds;
    private int attemptsRemaining;
    private String message;
}
