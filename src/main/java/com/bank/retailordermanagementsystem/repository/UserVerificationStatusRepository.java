package com.bank.retailordermanagementsystem.repository;

import com.bank.retailordermanagementsystem.entity.UserVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserVerificationStatusRepository extends JpaRepository<UserVerificationStatus, Long> {
    Optional<UserVerificationStatus> findByUserId(Long userId);
}
