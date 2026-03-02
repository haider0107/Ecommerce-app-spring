package com.ecommerce.app.order.controller;


import com.ecommerce.app.order.dto.ApiResponse;
import com.ecommerce.app.order.dto.OrderResponse;
import com.ecommerce.app.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestHeader("X-User-ID") String userId) {

        OrderResponse orderResponse = orderService.createOrder(userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .status(201)
                        .message("Order created successfully")
                        .data(orderResponse)
                        .timestamp(LocalDateTime.now())
                        .build());
    }
}
