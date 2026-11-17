package com.bank.retailordermanagementsystem.notification;

import com.bank.retailordermanagementsystem.entity.NotificationLog;
import com.bank.retailordermanagementsystem.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;

    @Value("${spring.mail.username:noreply@retailhub.com}")
    private String fromEmail;

    public boolean sendOtpEmail(String recipientEmail, String otpCode) {
        log.info("Sending OTP email to [{}]", recipientEmail);

        String subject = "Your RetailHub Security Verification Code";
        String messageBody = "Dear Customer,\n\nYour 6-digit OTP verification code is: " + otpCode + 
                             "\n\nThis code will expire in 5 minutes. Do not share this OTP with anyone.\n\nThank you,\nRetailHub Team";

        boolean success;
        String errorMessage = null;

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(recipientEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(messageBody);

            mailSender.send(mailMessage);
            success = true;
        } catch (Exception e) {
            log.error("Failed to send OTP email to [{}]: {}", recipientEmail, e.getMessage());
            success = false;
            errorMessage = e.getMessage();
        }

        NotificationLog notification = NotificationLog.builder()
                .recipient(recipientEmail)
                .channel(NotificationLog.Channel.EMAIL)
                .messageContent("OTP Verification Email Code: [MASKED]")
                .status(success ? NotificationLog.DeliveryStatus.SENT : NotificationLog.DeliveryStatus.FAILED)
                .errorMessage(errorMessage)
                .providerResponseId("MAIL-" + System.currentTimeMillis())
                .build();

        notificationLogRepository.save(notification);
        return success;
    }
}
