package com.bank.retailordermanagementsystem.service;

import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.entity.EmailOtpVerification;
import com.bank.retailordermanagementsystem.entity.UserVerificationStatus;
import com.bank.retailordermanagementsystem.exception.OtpException;
import com.bank.retailordermanagementsystem.kafka.event.OtpEvent;
import com.bank.retailordermanagementsystem.kafka.event.VerificationEvent;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.notification.EmailNotificationService;
import com.bank.retailordermanagementsystem.repository.EmailOtpVerificationRepository;
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
public class EmailOtpService {

    private final EmailOtpVerificationRepository emailOtpRepository;
    private final UserVerificationStatusRepository userVerificationStatusRepository;
    private final EmailNotificationService emailNotificationService;
    private final KafkaEventProducer kafkaEventProducer;
    private final OtpUtil otpUtil;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional
    public OtpStatusResponse sendEmailOtp(String email) {
        log.info("Requesting Email OTP for [{}]", email);

        Optional<EmailOtpVerification> existingOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        LocalDateTime now = LocalDateTime.now();

        if (existingOpt.isPresent()) {
            EmailOtpVerification existing = existingOpt.get();
            if (existing.getCooldownUntil() != null && existing.getCooldownUntil().isAfter(now)) {
                long remainingSecs = ChronoUnit.SECONDS.between(now, existing.getCooldownUntil());
                throw new OtpException("Please wait " + remainingSecs + " seconds before requesting a new OTP.");
            }
        }

        String plainOtp = otpUtil.generateSixDigitOtp();
        String hashedOtp = otpUtil.hashOtp(plainOtp);

        EmailOtpVerification otpRecord = EmailOtpVerification.builder()
                .email(email)
                .otpHash(hashedOtp)
                .expiresAt(now.plusMinutes(OTP_EXPIRY_MINUTES))
                .cooldownUntil(now.plusSeconds(COOLDOWN_SECONDS))
                .attemptsCount(0)
                .verified(false)
                .build();

        emailOtpRepository.save(otpRecord);

        // Send Email
        emailNotificationService.sendOtpEmail(email, plainOtp);

        // Kafka Event
        kafkaEventProducer.sendEmailOtpEvent(
                OtpEvent.builder()
                        .eventId("EMAIL-OTP-" + System.currentTimeMillis())
                        .eventType("EMAIL_OTP_SENT")
                        .recipient(email)
                        .channel("EMAIL")
                        .action("REQUESTED")
                        .timestamp(now)
                        .build()
        );

        return OtpStatusResponse.builder()
                .identifier(email)
                .verified(false)
                .cooldownActive(true)
                .cooldownRemainingSeconds(COOLDOWN_SECONDS)
                .attemptsRemaining(MAX_ATTEMPTS)
                .message("OTP sent successfully to " + email)
                .build();
    }

    @Transactional
    public boolean verifyEmailOtp(String email, String inputOtp) {
        log.info("Verifying Email OTP for [{}]", email);

        EmailOtpVerification record = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new OtpException("No active OTP request found for " + email));

        LocalDateTime now = LocalDateTime.now();

        if (record.getExpiresAt().isBefore(now)) {
            throw new OtpException("OTP has expired. Please request a new verification code.");
        }

        if (record.getAttemptsCount() >= MAX_ATTEMPTS) {
            throw new OtpException("Maximum verification attempts exceeded. Please request a new OTP.");
        }

        if (!otpUtil.matches(inputOtp, record.getOtpHash())) {
            record.setAttemptsCount(record.getAttemptsCount() + 1);
            emailOtpRepository.save(record);
            int remaining = MAX_ATTEMPTS - record.getAttemptsCount();
            throw new OtpException("Invalid OTP code. " + remaining + " attempts remaining.");
        }

        record.setVerified(true);
        emailOtpRepository.save(record);

        // Update UserVerificationStatus
        UserVerificationStatus status = userVerificationStatusRepository.findByUserId(1L)
                .orElse(UserVerificationStatus.builder().userId(1L).build());

        status.setEmailVerified(true);
        status.setEmailVerifiedAt(now);
        status.setKycLevel(UserVerificationStatus.KycLevel.BASIC);
        userVerificationStatusRepository.save(status);

        // Publish Kafka Verification Event
        kafkaEventProducer.sendVerificationEvent(
                VerificationEvent.builder()
                        .eventId("VERIF-EMAIL-" + System.currentTimeMillis())
                        .eventType("EMAIL_VERIFIED")
                        .userId(1L)
                        .verificationType("EMAIL")
                        .status("VERIFIED")
                        .timestamp(now)
                        .build()
        );

        return true;
    }

    public OtpStatusResponse getStatus(String email) {
        Optional<EmailOtpVerification> recordOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (recordOpt.isEmpty()) {
            return OtpStatusResponse.builder().identifier(email).verified(false).message("No record found").build();
        }

        EmailOtpVerification record = recordOpt.get();
        LocalDateTime now = LocalDateTime.now();
        boolean cooldownActive = record.getCooldownUntil() != null && record.getCooldownUntil().isAfter(now);
        long remainingSecs = cooldownActive ? ChronoUnit.SECONDS.between(now, record.getCooldownUntil()) : 0;

        return OtpStatusResponse.builder()
                .identifier(email)
                .verified(record.isVerified())
                .cooldownActive(cooldownActive)
                .cooldownRemainingSeconds(remainingSecs)
                .attemptsRemaining(Math.max(0, MAX_ATTEMPTS - record.getAttemptsCount()))
                .message(record.isVerified() ? "Email address verified" : "Pending verification")
                .build();
    }
}
