package com.ecommerce.app.order.controller;

import com.ecommerce.app.order.dto.ApiResponse;
import com.ecommerce.app.order.dto.CartItemRequest;
import com.ecommerce.app.order.model.CartItem;
import com.ecommerce.app.order.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<ApiResponse<CartItem>> addToCart(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody CartItemRequest request) {

        CartItem cartItem = cartService.addToCart(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CartItem>builder()
                        .success(true)
                        .status(201)
                        .message("Item added to cart")
                        .data(cartItem)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @RequestHeader("X-User-ID") String userId,
            @PathVariable String productId) {

        cartService.deleteItemFromCart(userId, productId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .status(200)
                        .message("Item removed from cart")
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItem>>> getCart(
            @RequestHeader("X-User-ID") String userId) {

        List<CartItem> cartItems = cartService.getCart(userId);

        return ResponseEntity.ok(
                ApiResponse.<List<CartItem>>builder()
                        .success(true)
                        .status(200)
                        .message("Cart fetched successfully")
                        .data(cartItems)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

}
