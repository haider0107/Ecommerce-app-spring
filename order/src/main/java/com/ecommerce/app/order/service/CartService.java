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
    public CartItem addToCart(String keycloakId, CartItemRequest request) {

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
                userServiceClient.getCurrentUser().getData();

        if (userResponse == null)
            throw new ResourceNotFoundException("User not found");

        String userId = userResponse.getId();

        CartItem existingCartItem =
                cartItemRepository.findByKeycloakIdAndProductId(
                        keycloakId, request.getProductId());

        if (existingCartItem != null) {

            existingCartItem.setQuantity(
                    existingCartItem.getQuantity() + request.getQuantity());

//            existingCartItem.setPrice(BigDecimal.valueOf(1000.00));
            if(existingCartItem.getUserId() == null){
                existingCartItem.setUserId(userId);
            }

            return cartItemRepository.save(existingCartItem);

        } else {

            CartItem cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setKeycloakId(keycloakId);
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(productResponse.getPrice());

            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem addToCartFallback(
            String keycloakId,
            CartItemRequest request,
            Exception exception) {

        throw new RuntimeException("Product service is currently unavailable");
    }

    public void deleteItemFromCart(String keycloakId, String productId) {

        CartItem cartItem =
                cartItemRepository.findByKeycloakIdAndProductId(keycloakId, productId);

        if (cartItem == null)
            throw new ResourceNotFoundException("Cart item not found");

        cartItemRepository.delete(cartItem);
    }

    public List<CartItem> getCart(String keycloakId) {
        return cartItemRepository.findByKeycloakId(keycloakId);
    }

    public void clearCart(String keycloakId) {
        cartItemRepository.deleteByKeycloakId(keycloakId);
    }
}
