package com.bank.retailordermanagementsystem.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpUtil {

    private final SecureRandom secureRandom = new SecureRandom();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String generateSixDigitOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    public String hashOtp(String plainOtp) {
        return passwordEncoder.encode(plainOtp);
    }

    public boolean matches(String plainOtp, String hashedOtp) {
        return passwordEncoder.matches(plainOtp, hashedOtp);
    }
}
