package com.truong.repository;

import com.truong.domain.dto.response.OrderResponse;
import com.truong.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByCode(String code);

    List<Order> findByCustomerPhone(String customerPhone);
}
