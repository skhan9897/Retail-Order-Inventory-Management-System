package com.bank.retailordermanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VerifyAadhaarOtpRequest {

    @NotBlank(message = "Transaction reference ID is required")
    private String transactionRefId;

    @NotBlank(message = "Aadhaar OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Aadhaar OTP must be a 6-digit number")
    private String otp;
}
