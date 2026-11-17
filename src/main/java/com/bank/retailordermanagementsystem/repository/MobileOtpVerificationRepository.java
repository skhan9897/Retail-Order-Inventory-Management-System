package com.bank.retailordermanagementsystem.repository;

import com.bank.retailordermanagementsystem.entity.MobileOtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MobileOtpVerificationRepository extends JpaRepository<MobileOtpVerification, Long> {
    Optional<MobileOtpVerification> findTopByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
    void deleteByMobileNumber(String mobileNumber);
}
