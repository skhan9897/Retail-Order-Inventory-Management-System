package com.bank.retailordermanagementsystem.repository;

import com.bank.retailordermanagementsystem.entity.AadhaarVerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AadhaarVerificationRecordRepository extends JpaRepository<AadhaarVerificationRecord, Long> {
    Optional<AadhaarVerificationRecord> findByTransactionRefId(String transactionRefId);
    Optional<AadhaarVerificationRecord> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}
