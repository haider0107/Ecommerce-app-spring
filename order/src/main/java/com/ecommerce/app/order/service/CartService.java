package com.ecommerce.app.order.service;

import com.ecommerce.app.order.clients.ProductServiceClient;
import com.ecommerce.app.order.clients.UserServiceClient;
import com.ecommerce.app.order.dto.ApiResponse;
import com.ecommerce.app.order.dto.CartItemRequest;
import com.ecommerce.app.order.dto.ProductResponse;
import com.ecommerce.app.order.dto.UserResponse;
import com.ecommerce.app.order.exception.BadRequestException;
import com.ecommerce.app.order.exception.ResourceNotFoundException;
import com.ecommerce.app.order.model.CartItem;
import com.ecommerce.app.order.repository.CartItemRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;

    //    @CircuitBreaker(name = "productService", fallbackMethod = "addToCartFallback")
    @Retry(name = "retryBreaker", fallbackMethod = "addToCartFallback")
    public CartItem addToCart(String userId, CartItemRequest request) {

//        ProductResponse productResponse =
//                productServiceClient.getProductDetails(request.getProductId());

        ApiResponse<ProductResponse> response =
                productServiceClient.getProductDetails(request.getProductId());

        ProductResponse productResponse = response.getData();

        if (productResponse == null)
            throw new ResourceNotFoundException("Product not found");

        if (productResponse.getStockQuantity() < request.getQuantity())
            throw new BadRequestException("Insufficient stock");

        UserResponse userResponse =
                userServiceClient.getUserDetails(userId);

        if (userResponse == null)
            throw new ResourceNotFoundException("User not found");

        CartItem existingCartItem =
                cartItemRepository.findByUserIdAndProductId(
                        userId, request.getProductId());

        if (existingCartItem != null) {

            existingCartItem.setQuantity(
                    existingCartItem.getQuantity() + request.getQuantity());

            existingCartItem.setPrice(BigDecimal.valueOf(1000.00));

            return cartItemRepository.save(existingCartItem);

        } else {

            CartItem cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(BigDecimal.valueOf(1000.00));

            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem addToCartFallback(
            String userId,
            CartItemRequest request,
            Exception exception) {

        throw new RuntimeException("Product service is currently unavailable");
    }

    public void deleteItemFromCart(String userId, String productId) {

        CartItem cartItem =
                cartItemRepository.findByUserIdAndProductId(userId, productId);

        if (cartItem == null)
            throw new ResourceNotFoundException("Cart item not found");

        cartItemRepository.delete(cartItem);
    }

    public List<CartItem> getCart(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
