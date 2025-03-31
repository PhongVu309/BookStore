package com.example.bookstore.repository;

import com.example.bookstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByDiscountGreaterThan(Integer discount);
    // Sửa method để sử dụng join thay vì direct relationship
    @Query("SELECT p FROM Product p JOIN Category c ON p.category_id = c.id WHERE c.name = :categoryName")
    List<Product> findByCategory_Name(@Param("categoryName") String categoryName);
}

