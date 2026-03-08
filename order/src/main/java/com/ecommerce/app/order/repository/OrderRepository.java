package com.ecommerce.app.order.repository;

import com.ecommerce.app.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdAndKeycloakId(Long id, String keycloakId);
}
