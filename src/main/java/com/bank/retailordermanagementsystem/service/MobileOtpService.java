package com.bank.retailordermanagementsystem.service;

import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.entity.MobileOtpVerification;
import com.bank.retailordermanagementsystem.entity.UserVerificationStatus;
import com.bank.retailordermanagementsystem.exception.OtpException;
import com.bank.retailordermanagementsystem.kafka.event.OtpEvent;
import com.bank.retailordermanagementsystem.kafka.event.VerificationEvent;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.notification.SmsNotificationService;
import com.bank.retailordermanagementsystem.repository.MobileOtpVerificationRepository;
import com.bank.retailordermanagementsystem.repository.UserVerificationStatusRepository;
import com.bank.retailordermanagementsystem.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MobileOtpService {

    private final MobileOtpVerificationRepository mobileOtpRepository;
    private final UserVerificationStatusRepository userVerificationStatusRepository;
    private final SmsNotificationService smsNotificationService;
    private final KafkaEventProducer kafkaEventProducer;
    private final OtpUtil otpUtil;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional
    public OtpStatusResponse sendMobileOtp(String mobileNumber) {
        log.info("Requesting Mobile OTP for [{}]", mobileNumber);

        Optional<MobileOtpVerification> existingOpt = mobileOtpRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobileNumber);
        LocalDateTime now = LocalDateTime.now();

        if (existingOpt.isPresent()) {
            MobileOtpVerification existing = existingOpt.get();
            if (existing.getCooldownUntil() != null && existing.getCooldownUntil().isAfter(now)) {
                long remainingSecs = ChronoUnit.SECONDS.between(now, existing.getCooldownUntil());
                throw new OtpException("Please wait " + remainingSecs + " seconds before requesting a new OTP.");
            }
        }

        String plainOtp = otpUtil.generateSixDigitOtp();
        String hashedOtp = otpUtil.hashOtp(plainOtp);

        MobileOtpVerification otpRecord = MobileOtpVerification.builder()
                .mobileNumber(mobileNumber)
                .otpHash(hashedOtp)
                .expiresAt(now.plusMinutes(OTP_EXPIRY_MINUTES))
                .cooldownUntil(now.plusSeconds(COOLDOWN_SECONDS))
                .attemptsCount(0)
                .verified(false)
                .build();

        mobileOtpRepository.save(otpRecord);

        // Send SMS
        String smsText = "Your RetailHub verification code is: " + plainOtp + ". Valid for 5 minutes.";
        smsNotificationService.sendSms(mobileNumber, smsText);

        // Kafka Event
        kafkaEventProducer.sendMobileOtpEvent(
                OtpEvent.builder()
                        .eventId("MOB-OTP-" + System.currentTimeMillis())
                        .eventType("MOBILE_OTP_SENT")
                        .recipient(mobileNumber)
                        .channel("MOBILE")
                        .action("REQUESTED")
                        .timestamp(now)
                        .build()
        );

        return OtpStatusResponse.builder()
                .identifier(mobileNumber)
                .verified(false)
                .cooldownActive(true)
                .cooldownRemainingSeconds(COOLDOWN_SECONDS)
                .attemptsRemaining(MAX_ATTEMPTS)
                .message("OTP sent successfully to " + mobileNumber)
                .build();
    }

    @Transactional
    public boolean verifyMobileOtp(String mobileNumber, String inputOtp) {
        log.info("Verifying Mobile OTP for [{}]", mobileNumber);

        MobileOtpVerification record = mobileOtpRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobileNumber)
                .orElseThrow(() -> new OtpException("No active OTP request found for " + mobileNumber));

        LocalDateTime now = LocalDateTime.now();

        if (record.getExpiresAt().isBefore(now)) {
            throw new OtpException("OTP has expired. Please request a new verification code.");
        }

        if (record.getAttemptsCount() >= MAX_ATTEMPTS) {
            throw new OtpException("Maximum verification attempts exceeded. Please request a new OTP.");
        }

        if (!otpUtil.matches(inputOtp, record.getOtpHash())) {
            record.setAttemptsCount(record.getAttemptsCount() + 1);
            mobileOtpRepository.save(record);
            int remaining = MAX_ATTEMPTS - record.getAttemptsCount();
            throw new OtpException("Invalid OTP code. " + remaining + " attempts remaining.");
        }

        record.setVerified(true);
        mobileOtpRepository.save(record);

        // Update UserVerificationStatus
        UserVerificationStatus status = userVerificationStatusRepository.findByUserId(1L)
                .orElse(UserVerificationStatus.builder().userId(1L).build());

        status.setMobileVerified(true);
        status.setMobileVerifiedAt(now);
        status.setKycLevel(UserVerificationStatus.KycLevel.BASIC);
        userVerificationStatusRepository.save(status);

        // Publish Kafka Verification Event
        kafkaEventProducer.sendVerificationEvent(
                VerificationEvent.builder()
                        .eventId("VERIF-MOB-" + System.currentTimeMillis())
                        .eventType("MOBILE_VERIFIED")
                        .userId(1L)
                        .verificationType("MOBILE")
                        .status("VERIFIED")
                        .timestamp(now)
                        .build()
        );

        return true;
    }

    public OtpStatusResponse getStatus(String mobileNumber) {
        Optional<MobileOtpVerification> recordOpt = mobileOtpRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobileNumber);
        if (recordOpt.isEmpty()) {
            return OtpStatusResponse.builder().identifier(mobileNumber).verified(false).message("No record found").build();
        }

        MobileOtpVerification record = recordOpt.get();
        LocalDateTime now = LocalDateTime.now();
        boolean cooldownActive = record.getCooldownUntil() != null && record.getCooldownUntil().isAfter(now);
        long remainingSecs = cooldownActive ? ChronoUnit.SECONDS.between(now, record.getCooldownUntil()) : 0;

        return OtpStatusResponse.builder()
                .identifier(mobileNumber)
                .verified(record.isVerified())
                .cooldownActive(cooldownActive)
                .cooldownRemainingSeconds(remainingSecs)
                .attemptsRemaining(Math.max(0, MAX_ATTEMPTS - record.getAttemptsCount()))
                .message(record.isVerified() ? "Mobile number verified" : "Pending verification")
                .build();
    }
}
