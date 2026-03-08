package com.ecommerce.app.order.service;

import com.ecommerce.app.order.clients.ProductServiceClient;
import com.ecommerce.app.order.clients.UserServiceClient;
import com.ecommerce.app.order.dto.*;
import com.ecommerce.app.order.exception.BadRequestException;
import com.ecommerce.app.order.exception.ResourceNotFoundException;
import com.ecommerce.app.order.model.CartItem;
import com.ecommerce.app.order.model.Order;
import com.ecommerce.app.order.model.OrderItem;
import com.ecommerce.app.order.model.OrderStatus;
import com.ecommerce.app.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final StreamBridge   streamBridge;
    private final UserServiceClient userServiceClient;
    private final ProductServiceClient productServiceClient;

    public OrderResponse createOrder(String keycloakId) {

        List<CartItem> cartItems = cartService.getCart(keycloakId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty. Cannot create order.");
        }

        // Calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(CartItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        UserResponse userResponse = userServiceClient.getCurrentUser().getData();

        String userId = userResponse.getId();

        Order order = new Order();
        order.setUserId(userId);
        order.setKeycloakId(keycloakId);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTotalAmount(totalPrice);

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> new OrderItem(
                        null,
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        order
                ))
                .toList();

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order creation
        cartService.clearCart(keycloakId);

        // Publish order created event
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getKeycloakId(),
                savedOrder.getStatus(),
                mapToOrderItemDTOs(savedOrder.getItems()),
                savedOrder.getTotalAmount(),
                savedOrder.getCreatedAt()
        );
        streamBridge.send("createOrder-out-0", event);

        return mapToOrderResponse(savedOrder);
    }

    public OrderDetailsResponse getOrderDetails(Long orderId, String keycloakId) {

        Order order = orderRepository
                .findByIdAndKeycloakId(orderId, keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        List<ProductResponse> items = order.getItems()
                .stream()
                .map(item -> {

                    ApiResponse<ProductResponse> response =
                            productServiceClient.getProductDetails(item.getProductId());

                    return response.getData();

                })
                .toList();

        return new OrderDetailsResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                items,
                order.getCreatedAt()
        );
    }

    private List<OrderItemDTO> mapToOrderItemDTOs(List<OrderItem> items) {
        return items.stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(new BigDecimal(item.getQuantity()))
                )).collect(Collectors.toList());
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getItems().stream()
                        .map(orderItem -> new OrderItemDTO(
                                orderItem.getId(),
                                orderItem.getProductId(),
                                orderItem.getQuantity(),
                                orderItem.getPrice(),
                                orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity()))
                        ))
                        .toList(),
                order.getCreatedAt()
        );
    }
}
