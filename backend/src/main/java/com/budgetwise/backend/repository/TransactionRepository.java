package com.budgetwise.backend.repository;

import com.budgetwise.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Spring Data JPA will implement this automatically
    List<Transaction> findByUserId(Long userId);
}
