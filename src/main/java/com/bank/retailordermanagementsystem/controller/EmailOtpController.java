package com.bank.retailordermanagementsystem.controller;

import com.bank.retailordermanagementsystem.dto.EmailOtpRequest;
import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.dto.VerifyEmailOtpRequest;
import com.bank.retailordermanagementsystem.service.EmailOtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp/email")
@RequiredArgsConstructor
public class EmailOtpController {

    private final EmailOtpService emailOtpService;

    @PostMapping("/send")
    public ResponseEntity<OtpStatusResponse> sendEmailOtp(@Valid @RequestBody EmailOtpRequest request) {
        OtpStatusResponse response = emailOtpService.sendEmailOtp(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend")
    public ResponseEntity<OtpStatusResponse> resendEmailOtp(@Valid @RequestBody EmailOtpRequest request) {
        OtpStatusResponse response = emailOtpService.sendEmailOtp(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyEmailOtp(@Valid @RequestBody VerifyEmailOtpRequest request) {
        boolean verified = emailOtpService.verifyEmailOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(Map.of(
                "success", verified,
                "email", request.getEmail(),
                "message", "Email address verified successfully"
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<OtpStatusResponse> getEmailOtpStatus(@RequestParam String email) {
        OtpStatusResponse response = emailOtpService.getStatus(email);
        return ResponseEntity.ok(response);
    }
}
