package com.bank.retailordermanagementsystem.aadhaar;

public interface AadhaarProviderClient {

    AadhaarOtpResponse requestAadhaarOtp(String maskedAadhaar, String clientTxnId);

    AadhaarVerifyResponse verifyAadhaarOtp(String providerTxnId, String otp);

    record AadhaarOtpResponse(boolean success, String providerTxnId, String message) {}

    record AadhaarVerifyResponse(boolean success, String providerTxnId, String maskedAadhaar, String message) {}
}
