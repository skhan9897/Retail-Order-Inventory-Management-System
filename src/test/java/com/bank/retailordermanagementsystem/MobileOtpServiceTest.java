package com.bank.retailordermanagementsystem;

import com.bank.retailordermanagementsystem.dto.OtpStatusResponse;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.notification.SmsNotificationService;
import com.bank.retailordermanagementsystem.repository.MobileOtpVerificationRepository;
import com.bank.retailordermanagementsystem.repository.UserVerificationStatusRepository;
import com.bank.retailordermanagementsystem.service.MobileOtpService;
import com.bank.retailordermanagementsystem.util.OtpUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MobileOtpServiceTest {

    @Mock
    private MobileOtpVerificationRepository mobileOtpRepository;

    @Mock
    private UserVerificationStatusRepository userVerificationStatusRepository;

    @Mock
    private SmsNotificationService smsNotificationService;

    @Mock
    private KafkaEventProducer kafkaEventProducer;

    @Mock
    private OtpUtil otpUtil;

    @InjectMocks
    private MobileOtpService mobileOtpService;

    @BeforeEach
    void setUp() {
        when(otpUtil.generateSixDigitOtp()).thenReturn("123456");
        when(otpUtil.hashOtp("123456")).thenReturn("$2a$10$mockHashedOtpValue");
    }

    @Test
    void testSendMobileOtpSuccess() {
        when(mobileOtpRepository.findTopByMobileNumberOrderByCreatedAtDesc(anyString())).thenReturn(Optional.empty());

        OtpStatusResponse response = mobileOtpService.sendMobileOtp("9876543210");

        assertNotNull(response);
        assertEquals("9876543210", response.getIdentifier());
        assertFalse(response.isVerified());
        assertTrue(response.isCooldownActive());
    }
}
