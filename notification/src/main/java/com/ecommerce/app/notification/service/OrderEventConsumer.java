package com.ecommerce.app.notification.service;

import com.ecommerce.app.notification.model.Notification;
import com.ecommerce.app.notification.payload.OrderCreatedEvent;
import com.ecommerce.app.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.function.Consumer;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    @Bean
    public Consumer<OrderCreatedEvent> orderCreated() {
        return event -> {

            Notification notification = Notification.builder()
                    .orderId(event.getOrderId())
                    .userId(event.getUserId())
                    .message("Order created successfully for Order ID " + event.getOrderId())
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            repository.save(notification);

            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + event.getUserId(),
                    notification
            );

            System.out.println(notification);

            log.info("Notification created for user {}", event.getUserId());
        };
    }
}
