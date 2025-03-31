package com.example.bookstore.controller;

import com.example.bookstore.model.Publisher;
import com.example.bookstore.service.PublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publisher")
public class PublisherController {
    @Autowired
    private PublisherService publisherService;

    @GetMapping
    public List<Publisher> getPublisher() {
        return publisherService.getAllPublishers();
    }
}
