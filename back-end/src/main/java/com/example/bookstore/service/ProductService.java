package com.example.bookstore.service;

import com.example.bookstore.model.Product;
import com.example.bookstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        // Không cần set Category object nữa
        return productRepository.save(product);
    }

    public Product updateProduct(Integer id, Product product) {
        product.setId(id);
        // Không cần set Category object nữa
        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    public List<Product> getFlashSaleProducts() {
        return productRepository.findByDiscountGreaterThan(30);
    }

    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategory_Name(categoryName);
    }
}
