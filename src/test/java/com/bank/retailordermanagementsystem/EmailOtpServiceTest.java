package com.bank.retailordermanagementsystem;

import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.notification.EmailNotificationService;
import com.bank.retailordermanagementsystem.repository.EmailOtpVerificationRepository;
import com.bank.retailordermanagementsystem.repository.UserVerificationStatusRepository;
import com.bank.retailordermanagementsystem.service.EmailOtpService;
import com.bank.retailordermanagementsystem.util.OtpUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmailOtpServiceTest {

    @Mock
    private EmailOtpVerificationRepository emailOtpRepository;

    @Mock
    private UserVerificationStatusRepository userVerificationStatusRepository;

    @Mock
    private EmailNotificationService emailNotificationService;

    @Mock
    private KafkaEventProducer kafkaEventProducer;

    @Mock
    private OtpUtil otpUtil;

    @InjectMocks
    private EmailOtpService emailOtpService;

    @BeforeEach
    void setUp() {
        when(otpUtil.generateSixDigitOtp()).thenReturn("654321");
        when(otpUtil.hashOtp("654321")).thenReturn("$2a$10$mockHashedEmailOtp");
    }

    @Test
    void testSendEmailOtpSuccess() {
        when(emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(anyString())).thenReturn(Optional.empty());

        OtpStatusResponse response = emailOtpService.sendEmailOtp("test@retailhub.com");

        assertNotNull(response);
        assertEquals("test@retailhub.com", response.getIdentifier());
        assertFalse(response.isVerified());
    }
}
