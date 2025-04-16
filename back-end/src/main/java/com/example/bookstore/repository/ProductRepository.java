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
    List<Product> findByNameContainingIgnoreCase(String keyword);
    
    @Query("SELECT p FROM Product p JOIN Category c ON p.category_id = c.id WHERE c.name = :categoryName")
    List<Product> findByCategory_Name(@Param("categoryName") String categoryName);

    @Query("SELECT p FROM Product p JOIN p.author a WHERE a.name = :authorName")
    List<Product> findByAuthor_Name(@Param("authorName") String authorName);

    @Query("SELECT p FROM Product p JOIN Publisher pu ON p.publisher_id = pu.id WHERE pu.name = :publisherName")
    List<Product> findByPublisher_Name(@Param("publisherName") String publisherName);
    
}

