package com.bank.retailordermanagementsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailOtpRequest {

    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email address format")
    private String email;
}
