package com.example.bookstore.service;

import com.example.bookstore.model.OrderDetail;
import com.example.bookstore.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderDetailService {
    
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getOrderDetailsByOrderId(Integer orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }

    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public void deleteOrderDetail(Integer id) {
        orderDetailRepository.deleteById(id);
    }

    public List<OrderDetail> createOrderDetails(List<OrderDetail> orderDetails) {
        return orderDetailRepository.saveAll(orderDetails);
    }
}