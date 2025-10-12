package com.example.bookstore.repository;

import com.example.bookstore.model.Order;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(int userId);

    @Query("SELECT DATE(o.createdAt) as date, SUM(o.totalPrice) as total FROM Order o " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate GROUP BY DATE(o.createdAt)")
    List<Object[]> getStatsByDay(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m') as month, " +
           "SUM(o.totalPrice) as total FROM Order o " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m')")
    List<Object[]> getStatsByMonth(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT YEAR(o.createdAt) as year, SUM(o.totalPrice) as total FROM Order o " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate GROUP BY YEAR(o.createdAt)")
    List<Object[]> getStatsByYear(LocalDateTime startDate, LocalDateTime endDate);
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
