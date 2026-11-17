package com.bank.retailordermanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AadhaarOtpRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Aadhaar number is required")
    @Pattern(regexp = "^[0-9]{12}$", message = "Aadhaar number must be a 12-digit number")
    private String aadhaarNumber;
}
