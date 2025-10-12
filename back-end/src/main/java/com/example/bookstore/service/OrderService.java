package com.example.bookstore.service;

import com.example.bookstore.model.Order;
import com.example.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
        if (order.getUserId() == null) {
            order.setUserId(null);
        }
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

    public List<Order> getOrdersByUserId(int userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<Object[]> getStatsByDay(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getStatsByDay(startDate, endDate);
    }

    public List<Object[]> getStatsByMonth(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getStatsByMonth(startDate, endDate);
    }

    public List<Object[]> getStatsByYear(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getStatsByYear(startDate, endDate);
    }

    // Thêm phương thức để lấy tổng quan thống kê
    public OrderStatistics getOrderStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = getOrdersByDateRange(startDate, endDate);

        OrderStatistics stats = new OrderStatistics();
        stats.setTotalOrders((long) orders.size());
        stats.setTotalRevenue(orders.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue());
        stats.setPendingOrders(orders.stream()
                .filter(o -> "PENDING".equals(o.getOrderStatus()))
                .count());
        stats.setSuccessOrders(orders.stream()
                .filter(o -> "COMPLETED".equals(o.getOrderStatus()))
                .count());

        return stats;
    }
}

// Thêm class OrderStatistics
class OrderStatistics {
    private Long totalOrders;
    private Double totalRevenue;
    private Long pendingOrders;
    private Long successOrders;

    // Getters and Setters
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }

    public Long getSuccessOrders() { return successOrders; }
    public void setSuccessOrders(Long successOrders) { this.successOrders = successOrders; }
}
