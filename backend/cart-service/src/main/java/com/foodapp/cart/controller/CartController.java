package com.foodapp.cart.controller;

import com.foodapp.cart.entity.CartItem;
import com.foodapp.cart.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository repository;

    @GetMapping("/{email}")
    public List<CartItem> getCart(@PathVariable String email) {
        return repository.findByUserEmail(email);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem item) {
        Optional<CartItem> existing = repository.findByUserEmailAndMenuItemId(item.getUserEmail(), item.getMenuItemId());
        
        if (existing.isPresent()) {
            CartItem cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + item.getQuantity());
            return ResponseEntity.ok(repository.save(cartItem));
        } else {
            return ResponseEntity.ok(repository.save(item));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return repository.findById(id).map(item -> {
            item.setQuantity(quantity);
            return ResponseEntity.ok(repository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping("/clear/{email}")
    public ResponseEntity<Void> clearCart(@PathVariable String email) {
        repository.deleteByUserEmail(email);
        return ResponseEntity.noContent().build();
    }
}
