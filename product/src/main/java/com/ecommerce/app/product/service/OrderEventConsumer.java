package com.ecommerce.app.product.service;

import com.ecommerce.app.product.model.Product;
import com.ecommerce.app.product.payload.OrderCreatedEvent;
import com.ecommerce.app.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {
    private final ProductRepository productRepository;

    @Bean
    public Consumer<OrderCreatedEvent> orderCreated() {
        return event -> {

            log.info("Received order event {}", event.getOrderId());

            event.getItems().forEach(item -> {

                Product product = productRepository
                        .findById(Long.valueOf(item.getProductId()))
                        .orElseThrow(() ->
                                new RuntimeException("Product not found"));

                product.setStockQuantity(
                        product.getStockQuantity() - item.getQuantity()
                );

                productRepository.save(product);
            });
        };
    }
}
