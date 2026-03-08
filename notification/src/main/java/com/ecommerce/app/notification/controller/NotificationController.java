package com.ecommerce.app.notification.controller;

import com.ecommerce.app.notification.model.Notification;
import com.ecommerce.app.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repository;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Mark single notification as read
    @PatchMapping("/{id}/read")
    public void markNotificationRead(@PathVariable Long id) {
        repository.markNotificationAsRead(id);
    }

    // Mark all notifications as read
    @PatchMapping("/read-all/{userId}")
    public void markAllNotificationsRead(@PathVariable String userId) {
        repository.markAllNotificationsAsRead(userId);
    }
}
