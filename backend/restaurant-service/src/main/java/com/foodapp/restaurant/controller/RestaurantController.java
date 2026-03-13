package com.foodapp.restaurant.controller;

import com.foodapp.restaurant.entity.Restaurant;
import com.foodapp.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository repository;

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        Optional<Restaurant> restaurant = repository.findById(id);
        return restaurant.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // Role-based protection will eventually wrap this at the Gateway layer,
    // or through method-level security, but primarily the user MUST pass a JWT.
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant saved = repository.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant details) {
        return repository.findById(id).map(r -> {
            r.setName(details.getName());
            r.setImageUrl(details.getImageUrl());
            r.setDescription(details.getDescription());
            r.setCuisineType(details.getCuisineType());
            r.setAddress(details.getAddress());
            r.setOpeningHours(details.getOpeningHours());
            return ResponseEntity.ok(repository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
