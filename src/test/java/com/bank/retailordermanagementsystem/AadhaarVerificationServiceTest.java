package com.bank.retailordermanagementsystem;

import com.bank.retailordermanagementsystem.aadhaar.AadhaarProviderClient;
import com.bank.retailordermanagementsystem.exception.VerificationException;
import com.bank.retailordermanagementsystem.kafka.producer.KafkaEventProducer;
import com.bank.retailordermanagementsystem.repository.AadhaarVerificationRecordRepository;
import com.bank.retailordermanagementsystem.repository.UserVerificationStatusRepository;
import com.bank.retailordermanagementsystem.service.AadhaarVerificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AadhaarVerificationServiceTest {

    @Mock
    private AadhaarVerificationRecordRepository recordRepository;

    @Mock
    private UserVerificationStatusRepository userVerificationStatusRepository;

    @Mock
    private AadhaarProviderClient aadhaarProviderClient;

    @Mock
    private KafkaEventProducer kafkaEventProducer;

    @InjectMocks
    private AadhaarVerificationService aadhaarVerificationService;

    @Test
    void testConsentRequiredValidation() {
        assertThrows(VerificationException.class, () -> {
            aadhaarVerificationService.recordUserConsent(1L, false);
        });
    }

    @Test
    void testRequestAadhaarOtpSuccess() {
        when(aadhaarProviderClient.requestAadhaarOtp(anyString(), anyString()))
                .thenReturn(new AadhaarProviderClient.AadhaarOtpResponse(true, "UIDAI-TXN-123", "OTP Sent"));

        String txnRef = aadhaarVerificationService.requestAadhaarOtp(1L, "999988889897");

        assertNotNull(txnRef);
        assertTrue(txnRef.startsWith("AADHAAR-TXN-"));
    }
}
