package com.bank.retailordermanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aadhaar_verification_records", indexes = {
    @Index(name = "idx_txn_ref", columnList = "transactionRefId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AadhaarVerificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionRefId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 4)
    private String lastFourDigits; // Only last 4 digits stored for data minimization

    private boolean userConsentGiven;

    private LocalDateTime consentTimestamp;

    @Column(nullable = false)
    private String providerTransactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    private String errorMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING,
        OTP_SENT,
        VERIFIED,
        FAILED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
