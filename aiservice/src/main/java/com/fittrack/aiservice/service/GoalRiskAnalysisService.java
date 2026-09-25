package com.fittrack.aiservice.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GoalRiskAnalysisService {

    public String analyzeGoalRisk(List<Map<String, Object>> goals) {

        if (goals == null || goals.isEmpty()) {
            return "No fitness goals found. Create a goal to enable goal risk analysis.";
        }

        boolean hasCompletedGoal = false;
        boolean hasAtRiskGoal = false;

        for (Map<String, Object> goal : goals) {

            Object completed = goal.get("completed");

            if (Boolean.TRUE.equals(completed)) {
                hasCompletedGoal = true;
                continue;
            }

            Object targetValue = goal.get("targetValue");
            Object currentValue = goal.get("currentValue");

            if (targetValue instanceof Number &&
                    currentValue instanceof Number) {

                double target = ((Number) targetValue).doubleValue();
                double current = ((Number) currentValue).doubleValue();

                if (target > 0) {

                    double progress =
                            (current / target) * 100;

                    if (progress < 50) {
                        hasAtRiskGoal = true;
                    }
                }
            }
        }

        if (hasAtRiskGoal) {
            return "One or more fitness goals may be at risk because progress is below 50% of the target.";
        }

        if (hasCompletedGoal) {
            return "At least one fitness goal has been completed. Continue tracking progress toward remaining goals.";
        }

        return "Current fitness goals are progressing without an immediate risk detected.";
    }
}