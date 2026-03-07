package com.ecommerce.app.order.repository;

import com.ecommerce.app.order.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByUserIdAndProductId(String userId, String productId);

    CartItem findByKeycloakIdAndProductId(String keycloakId, String productId);

    void deleteByKeycloakIdAndProductId(String keycloakId, String productId);

    void deleteByUserIdAndProductId(String userId, String productId);

    List<CartItem> findByKeycloakId(String keycloakId);

    void deleteByKeycloakId(String keycloakId);

    List<CartItem> findByUserId(String userId);

    void deleteByUserId(String userId);
}
