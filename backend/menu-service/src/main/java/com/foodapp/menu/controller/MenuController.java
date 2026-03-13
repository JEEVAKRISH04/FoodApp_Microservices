package com.foodapp.menu.controller;

import com.foodapp.menu.entity.MenuItem;
import com.foodapp.menu.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuItemRepository repository;

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuByRestaurant(@PathVariable Long restaurantId) {
        return repository.findByRestaurantId(restaurantId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // Role-based protection check usually verified upstream via Gateway JWT propagation
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        MenuItem saved = repository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem details) {
        return repository.findById(id).map(m -> {
            m.setName(details.getName());
            m.setCategory(details.getCategory());
            m.setPrice(details.getPrice());
            m.setImageUrl(details.getImageUrl());
            m.setDescription(details.getDescription());
            m.setIsAvailable(details.getIsAvailable());
            m.setIsVeg(details.getIsVeg());
            return ResponseEntity.ok(repository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
