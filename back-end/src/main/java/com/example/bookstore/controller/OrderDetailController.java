package com.example.bookstore.controller;

import com.example.bookstore.model.OrderDetail;
import com.example.bookstore.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrderId(@PathVariable Integer orderId) {
        List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrderId(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<OrderDetail>> createOrderDetails(@RequestBody List<OrderDetail> orderDetails) {
        List<OrderDetail> createdOrderDetails = orderDetailService.createOrderDetails(orderDetails);
        return ResponseEntity.ok(createdOrderDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Integer id) {
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.ok().build();
    }
}