package com.bank.retailordermanagementsystem.service;

import com.bank.retailordermanagementsystem.aadhaar.AadhaarProviderClient;
import com.bank.retailordermanagementsystem.dto.VerificationStatusResponse;
import com.bank.retailordermanagementsystem.entity.AadhaarVerificationRecord;
import com.bank.retailordermanagementsystem.entity.UserVerificationStatus;
import com.bank.retailordermanagementsystem.exception.VerificationException;
import com.bank.retailordermanagementsystem.kafka.event.VerificationEvent;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.repository.AadhaarVerificationRecordRepository;
import com.bank.retailordermanagementsystem.repository.UserVerificationStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AadhaarVerificationService {

    private final AadhaarVerificationRecordRepository recordRepository;
    private final UserVerificationStatusRepository userVerificationStatusRepository;
    private final AadhaarProviderClient aadhaarProviderClient;
    private final KafkaEventProducer kafkaEventProducer;

    @Transactional
    public boolean recordUserConsent(Long userId, boolean consentGiven) {
        log.info("Recording Aadhaar verification consent for User [{}]", userId);
        if (!consentGiven) {
            throw new VerificationException("User consent is required for Aadhaar e-KYC under UIDAI guidelines.");
        }
        return true;
    }

    @Transactional
    public String requestAadhaarOtp(Long userId, String fullAadhaarNumber) {
        log.info("Initiating Aadhaar OTP request for User [{}]", userId);

        String clientTxnRefId = "AADHAAR-TXN-" + System.currentTimeMillis();
        String lastFourDigits = fullAadhaarNumber.substring(fullAadhaarNumber.length() - 4);

        AadhaarProviderClient.AadhaarOtpResponse response = aadhaarProviderClient.requestAadhaarOtp(
                "XXXX-XXXX-" + lastFourDigits,
                clientTxnRefId
        );

        if (!response.success()) {
            throw new VerificationException("Aadhaar OTP request failed via provider: " + response.message());
        }

        AadhaarVerificationRecord record = AadhaarVerificationRecord.builder()
                .userId(userId)
                .transactionRefId(clientTxnRefId)
                .lastFourDigits(lastFourDigits)
                .userConsentGiven(true)
                .consentTimestamp(LocalDateTime.now())
                .providerTransactionId(response.providerTxnId())
                .status(AadhaarVerificationRecord.VerificationStatus.OTP_SENT)
                .build();

        recordRepository.save(record);

        kafkaEventProducer.sendVerificationEvent(
                VerificationEvent.builder()
                        .eventId("VERIF-AADHAAR-REQ-" + System.currentTimeMillis())
                        .eventType("AADHAAR_OTP_REQUESTED")
                        .userId(userId)
                        .verificationType("AADHAAR")
                        .status("OTP_SENT")
                        .transactionRefId(clientTxnRefId)
                        .timestamp(LocalDateTime.now())
                        .build()
        );

        return clientTxnRefId;
    }

    @Transactional
    public boolean verifyAadhaarOtp(String transactionRefId, String otp) {
        log.info("Verifying Aadhaar OTP for transactionRefId [{}]", transactionRefId);

        AadhaarVerificationRecord record = recordRepository.findByTransactionRefId(transactionRefId)
                .orElseThrow(() -> new VerificationException("Invalid or non-existent transaction reference ID: " + transactionRefId));

        AadhaarProviderClient.AadhaarVerifyResponse verifyResponse = aadhaarProviderClient.verifyAadhaarOtp(
                record.getProviderTransactionId(),
                otp
        );

        if (!verifyResponse.success()) {
            record.setStatus(AadhaarVerificationRecord.VerificationStatus.FAILED);
            record.setErrorMessage(verifyResponse.message());
            recordRepository.save(record);
            throw new VerificationException("Aadhaar OTP verification failed: " + verifyResponse.message());
        }

        record.setStatus(AadhaarVerificationRecord.VerificationStatus.VERIFIED);
        recordRepository.save(record);

        // Update UserVerificationStatus
        UserVerificationStatus status = userVerificationStatusRepository.findByUserId(record.getUserId())
                .orElse(UserVerificationStatus.builder().userId(record.getUserId()).build());

        status.setAadhaarVerified(true);
        status.setAadhaarVerifiedAt(LocalDateTime.now());
        status.setKycLevel(UserVerificationStatus.KycLevel.FULL);
        userVerificationStatusRepository.save(status);

        // Kafka Event
        kafkaEventProducer.sendVerificationEvent(
                VerificationEvent.builder()
                        .eventId("VERIF-AADHAAR-SUCCESS-" + System.currentTimeMillis())
                        .eventType("AADHAAR_VERIFIED")
                        .userId(record.getUserId())
                        .verificationType("AADHAAR")
                        .status("VERIFIED")
                        .transactionRefId(transactionRefId)
                        .timestamp(LocalDateTime.now())
                        .build()
        );

        return true;
    }

    public VerificationStatusResponse getVerificationStatus(Long userId) {
        UserVerificationStatus status = userVerificationStatusRepository.findByUserId(userId)
                .orElse(UserVerificationStatus.builder()
                        .userId(userId)
                        .kycLevel(UserVerificationStatus.KycLevel.UNVERIFIED)
                        .build());

        Optional<AadhaarVerificationRecord> aadhaarRecord = recordRepository.findTopByUserIdOrderByCreatedAtDesc(userId);

        String masked = aadhaarRecord.map(r -> "XXXX-XXXX-" + r.getLastFourDigits()).orElse("N/A");
        String txnId = aadhaarRecord.map(AadhaarVerificationRecord::getTransactionRefId).orElse(null);

        return VerificationStatusResponse.builder()
                .userId(userId)
                .mobileVerified(status.isMobileVerified())
                .emailVerified(status.isEmailVerified())
                .aadhaarVerified(status.isAadhaarVerified())
                .kycLevel(status.getKycLevel() != null ? status.getKycLevel().name() : "UNVERIFIED")
                .maskedAadhaar(masked)
                .transactionRefId(txnId)
                .build();
    }
}
