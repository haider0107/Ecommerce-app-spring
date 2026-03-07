package com.ecommerce.app.order.service;

import com.ecommerce.app.order.clients.UserServiceClient;
import com.ecommerce.app.order.dto.OrderCreatedEvent;
import com.ecommerce.app.order.dto.OrderItemDTO;
import com.ecommerce.app.order.dto.OrderResponse;
import com.ecommerce.app.order.dto.UserResponse;
import com.ecommerce.app.order.exception.BadRequestException;
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
