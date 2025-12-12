package com.budgetwise.backend.controller;

import com.budgetwise.backend.model.Goal;
import com.budgetwise.backend.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping("/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable UUID userId) {
        return goalService.getGoalsByUser(userId);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.createGoal(goal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable UUID id) {
        goalService.deleteGoal(id);
    }
}
