package com.ecommerce.app.order.service;

import com.ecommerce.app.order.dto.OrderItemDTO;
import com.ecommerce.app.order.dto.OrderResponse;
import com.ecommerce.app.order.exception.BadRequestException;
import com.ecommerce.app.order.model.CartItem;
import com.ecommerce.app.order.model.Order;
import com.ecommerce.app.order.model.OrderItem;
import com.ecommerce.app.order.model.OrderStatus;
import com.ecommerce.app.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartService cartService;
    private final OrderRepository orderRepository;

    public OrderResponse createOrder(String userId) {

        List<CartItem> cartItems = cartService.getCart(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty. Cannot create order.");
        }

        // Calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(CartItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUserId(userId);
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
        cartService.clearCart(userId);

        return mapToOrderResponse(savedOrder);
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
