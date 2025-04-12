package com.example.bookstore.service;

import com.example.bookstore.model.Order;
import com.example.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(int id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(int id, Order updatedOrder) {
        Order existingOrder = getOrderById(id);
        existingOrder.setOrderStatus(updatedOrder.getOrderStatus());
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(int id) {
        try {
            orderRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa đơn hàng: " + e.getMessage());
        }
    }
}
