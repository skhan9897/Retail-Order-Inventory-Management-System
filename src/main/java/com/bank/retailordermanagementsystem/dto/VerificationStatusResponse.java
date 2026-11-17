package com.bank.retailordermanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationStatusResponse {
    private Long userId;
    private boolean mobileVerified;
    private boolean emailVerified;
    private boolean aadhaarVerified;
    private String kycLevel;
    private String maskedAadhaar;
    private String transactionRefId;
}
