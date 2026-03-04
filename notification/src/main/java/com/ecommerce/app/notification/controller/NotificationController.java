package com.ecommerce.app.notification.controller;

import com.ecommerce.app.notification.model.Notification;
import com.ecommerce.app.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
