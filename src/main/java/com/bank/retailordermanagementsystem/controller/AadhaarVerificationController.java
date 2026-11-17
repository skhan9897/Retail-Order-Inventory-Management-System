package com.bank.retailordermanagementsystem.controller;

import com.bank.retailordermanagementsystem.dto.*;
import com.bank.retailordermanagementsystem.service.AadhaarVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/aadhaar")
@RequiredArgsConstructor
public class AadhaarVerificationController {

    private final AadhaarVerificationService aadhaarVerificationService;

    @PostMapping("/consent")
    public ResponseEntity<Map<String, Object>> recordConsent(@Valid @RequestBody AadhaarConsentRequest request) {
        boolean recorded = aadhaarVerificationService.recordUserConsent(request.getUserId(), request.isConsentGiven());
        return ResponseEntity.ok(Map.of(
                "success", recorded,
                "userId", request.getUserId(),
                "message", "User consent for Aadhaar e-KYC verification recorded successfully"
        ));
    }

    @PostMapping("/otp/request")
    public ResponseEntity<Map<String, Object>> requestAadhaarOtp(@Valid @RequestBody AadhaarOtpRequest request) {
        String transactionRefId = aadhaarVerificationService.requestAadhaarOtp(request.getUserId(), request.getAadhaarNumber());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "transactionRefId", transactionRefId,
                "message", "Aadhaar OTP requested via authorized UIDAI partner API"
        ));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<Map<String, Object>> verifyAadhaarOtp(@Valid @RequestBody VerifyAadhaarOtpRequest request) {
        boolean verified = aadhaarVerificationService.verifyAadhaarOtp(request.getTransactionRefId(), request.getOtp());
        return ResponseEntity.ok(Map.of(
                "success", verified,
                "transactionRefId", request.getTransactionRefId(),
                "message", "Aadhaar e-KYC verification completed successfully"
        ));
    }

    @GetMapping("/verification/status")
    public ResponseEntity<VerificationStatusResponse> getVerificationStatus(@RequestParam Long userId) {
        VerificationStatusResponse response = aadhaarVerificationService.getVerificationStatus(userId);
        return ResponseEntity.ok(response);
    }
}
