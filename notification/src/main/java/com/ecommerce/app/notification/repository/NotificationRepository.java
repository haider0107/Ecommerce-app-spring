package com.ecommerce.app.notification.repository;

import com.ecommerce.app.notification.model.Notification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE notifications n SET n.read = true WHERE n.id = :id")
    void markNotificationAsRead(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE notifications n SET n.read = true WHERE n.userId = :userId")
    void markAllNotificationsAsRead(String userId);
}
