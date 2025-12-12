package com.budgetwise.backend.service;

import com.budgetwise.backend.model.Goal;
import com.budgetwise.backend.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getGoalsByUser(UUID userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Optional<Goal> getGoalById(UUID id) {
        return goalRepository.findById(id);
    }

    public void deleteGoal(UUID id) {
        goalRepository.deleteById(id);
    }
}
