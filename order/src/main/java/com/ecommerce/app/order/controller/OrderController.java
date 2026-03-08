package com.ecommerce.app.order.controller;


import com.ecommerce.app.order.dto.ApiResponse;
import com.ecommerce.app.order.dto.OrderDetailsResponse;
import com.ecommerce.app.order.dto.OrderResponse;
import com.ecommerce.app.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal Jwt jwt) {

        String keycloakId = jwt.getSubject();
        OrderResponse orderResponse = orderService.createOrder(keycloakId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .status(201)
                        .message("Order created successfully")
                        .data(orderResponse)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDetailsResponse>> getOrderDetails(
            @PathVariable Long orderId,
            @AuthenticationPrincipal Jwt jwt) {

        String keycloakId = jwt.getSubject();

        OrderDetailsResponse response =
                orderService.getOrderDetails(orderId, keycloakId);

        return ResponseEntity.ok(
                ApiResponse.<OrderDetailsResponse>builder()
                        .success(true)
                        .status(200)
                        .message("Order details fetched successfully")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}
