package com.bank.retailordermanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Channel channel; // SMS, EMAIL

    @Column(nullable = false, length = 1000)
    private String messageContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status;

    private String providerResponseId;

    private String errorMessage;

    private LocalDateTime sentAt;

    public enum Channel {
        SMS,
        EMAIL,
        KAFKA_EVENT
    }

    public enum DeliveryStatus {
        SENT,
        FAILED,
        RETRYING
    }

    @PrePersist
    protected void onCreate() {
        this.sentAt = LocalDateTime.now();
    }
}
