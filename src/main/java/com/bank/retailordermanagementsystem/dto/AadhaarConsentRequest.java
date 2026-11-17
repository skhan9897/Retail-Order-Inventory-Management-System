package com.bank.retailordermanagementsystem.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AadhaarConsentRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @AssertTrue(message = "User consent is mandatory for Aadhaar verification under UIDAI guidelines")
    private boolean consentGiven;
}
