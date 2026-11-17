package com.bank.retailordermanagementsystem.controller;

import com.bank.retailordermanagementsystem.dto.MobileOtpRequest;
import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.dto.VerifyMobileOtpRequest;
import com.bank.retailordermanagementsystem.service.MobileOtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp/mobile")
@RequiredArgsConstructor
public class MobileOtpController {

    private final MobileOtpService mobileOtpService;

    @PostMapping("/send")
    public ResponseEntity<OtpStatusResponse> sendMobileOtp(@Valid @RequestBody MobileOtpRequest request) {
        OtpStatusResponse response = mobileOtpService.sendMobileOtp(request.getMobileNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend")
    public ResponseEntity<OtpStatusResponse> resendMobileOtp(@Valid @RequestBody MobileOtpRequest request) {
        OtpStatusResponse response = mobileOtpService.sendMobileOtp(request.getMobileNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyMobileOtp(@Valid @RequestBody VerifyMobileOtpRequest request) {
        boolean verified = mobileOtpService.verifyMobileOtp(request.getMobileNumber(), request.getOtp());
        return ResponseEntity.ok(Map.of(
                "success", verified,
                "mobileNumber", request.getMobileNumber(),
                "message", "Mobile number verified successfully"
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<OtpStatusResponse> getMobileOtpStatus(@RequestParam String mobileNumber) {
        OtpStatusResponse response = mobileOtpService.getStatus(mobileNumber);
        return ResponseEntity.ok(response);
    }
}
