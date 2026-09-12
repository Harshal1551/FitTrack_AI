package com.fittrack.activityservice.controller;

import com.fittrack.activityservice.dto.GoalRequest;
import com.fittrack.activityservice.model.Goal;
import com.fittrack.activityservice.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<Goal> createGoal(
            @RequestBody GoalRequest request,
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(
                goalService.createGoal(request, userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals(
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(
                goalService.getUserGoals(userId)
        );
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable String goalId,
            @RequestHeader("X-User-ID") String userId) {

        goalService.deleteGoal(goalId, userId);

        return ResponseEntity.noContent().build();
    }


}