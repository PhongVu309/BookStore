package com.example.bookstore.controller;

import com.example.bookstore.model.Product;
import com.example.bookstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/flash-sale")
    public List<Product> getFlashSaleProducts() {
        return productRepository.findByDiscountGreaterThan(30);
    }

    @GetMapping("/category/{categoryName}")
    public List<Product> getProductsByCategory(@PathVariable String categoryName) {
        return productRepository.findByCategory_Name(categoryName);
    }

    @GetMapping("/author/{authorName}")
    public List<Product> getProductsByAuthorName(@PathVariable String authorName) {
        return productRepository.findByAuthor_Name(authorName);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/publisher/{publisherName}")
    public List<Product> getProductsByPublisherName(@PathVariable String publisherName) {
        return productRepository.findByPublisher_Name(publisherName);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword.toLowerCase());
    }

    // Thêm các phương thức CRUD
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        product.setId(id);
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Integer id) {
        productRepository.deleteById(id);
    }
}
