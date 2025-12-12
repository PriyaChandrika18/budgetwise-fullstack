package com.budgetwise.backend.service;

import com.budgetwise.backend.model.Budget;
import com.budgetwise.backend.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getAllBudgets(UUID userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Optional<Budget> getBudgetById(UUID id) {
        return budgetRepository.findById(id);
    }

    public void deleteBudget(UUID id) {
        budgetRepository.deleteById(id);
    }
}
