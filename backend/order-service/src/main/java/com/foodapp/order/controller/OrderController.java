package com.foodapp.order.controller;

import com.foodapp.order.entity.Order;
import com.foodapp.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository repository;

    @GetMapping("/{email}")
    public List<Order> getOrderHistory(@PathVariable String email) {
        return repository.findByUserEmailOrderByOrderDateDesc(email);
    }
    
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        Order saved = repository.save(order);
        // Note: In an enterprise system, this would trigger an event broker or webhook
        // to empty the respective user's Cart via the Cart Service.
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    // Used by Admins to update status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id).map(o -> {
            o.setStatus(status);
            return ResponseEntity.ok(repository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }
}
