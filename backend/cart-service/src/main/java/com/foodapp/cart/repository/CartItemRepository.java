package com.foodapp.cart.repository;

import com.foodapp.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmail(String userEmail);
    Optional<CartItem> findByUserEmailAndMenuItemId(String userEmail, Long menuItemId);
    void deleteByUserEmail(String userEmail);
}
