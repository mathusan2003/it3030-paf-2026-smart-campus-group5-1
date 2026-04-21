package com.sliit.bookingmodule.service;

import com.sliit.bookingmodule.entity.Notification;
import com.sliit.bookingmodule.notifications.sms.SmsNotificationSender;
import com.sliit.bookingmodule.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SmsNotificationSender smsNotificationSender;

    public NotificationService(NotificationRepository notificationRepository, SmsNotificationSender smsNotificationSender) {
        this.notificationRepository = notificationRepository;
        this.smsNotificationSender = smsNotificationSender;
    }

    public Notification createNotification(String userId, String title, String message, String relatedType, String relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedType(relatedType);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);
        smsNotificationSender.sendToUserIfConfigured(userId, title + ": " + message);
        return saved;
    }

    public List<Notification> getNotificationsByUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
