package com.bank.retailordermanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_verification_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVerificationStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private boolean mobileVerified;
    private LocalDateTime mobileVerifiedAt;

    private boolean emailVerified;
    private LocalDateTime emailVerifiedAt;

    private boolean aadhaarVerified;
    private LocalDateTime aadhaarVerifiedAt;

    @Enumerated(EnumType.STRING)
    private KycLevel kycLevel;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum KycLevel {
        UNVERIFIED,
        BASIC, // Email or Mobile verified
        PARTIAL, // Email and Mobile verified
        FULL // Email, Mobile, and Aadhaar verified
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.kycLevel == null) {
            this.kycLevel = KycLevel.UNVERIFIED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
