package com.bank.retailordermanagementsystem.notification;

import com.bank.retailordermanagementsystem.entity.NotificationLog;
import com.bank.retailordermanagementsystem.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsNotificationService {

    private final NotificationLogRepository notificationLogRepository;

    @Value("${sms.provider.name:twilio}")
    private String smsProvider;

    @Value("${sms.provider.account-sid:AC_MOCK}")
    private String accountSid;

    public boolean sendSms(String mobileNumber, String messageText) {
        log.info("Sending SMS via provider [{}] to [{}]", smsProvider, mobileNumber);

        // Actual SMS provider HTTP call simulation/client execution
        boolean success = true;
        String providerResponseId = "SMS-" + System.currentTimeMillis();

        NotificationLog notification = NotificationLog.builder()
                .recipient(mobileNumber)
                .channel(NotificationLog.Channel.SMS)
                .messageContent(messageText)
                .status(success ? NotificationLog.DeliveryStatus.SENT : NotificationLog.DeliveryStatus.FAILED)
                .providerResponseId(providerResponseId)
                .build();

        notificationLogRepository.save(notification);
        return success;
    }
}
