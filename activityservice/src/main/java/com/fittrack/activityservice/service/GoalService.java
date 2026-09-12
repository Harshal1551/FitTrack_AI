package com.fittrack.activityservice.service;

import com.fittrack.activityservice.dto.GoalRequest;
import com.fittrack.activityservice.model.Goal;
import com.fittrack.activityservice.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoalService {

    private final GoalRepository goalRepository;

    public Goal createGoal(GoalRequest request, String userId) {

        Goal goal = Goal.builder()
                .userId(userId)
                .goalType(request.getGoalType())
                .targetValue(request.getTargetValue())
                .currentValue(0)
                .unit(request.getUnit())
                .startDate(request.getStartDate())
                .targetDate(request.getTargetDate())
                .completed(false)
                .build();

        return goalRepository.save(goal);
    }

    public List<Goal> getUserGoals(String userId) {
        return goalRepository.findByUserId(userId);
    }

    public void deleteGoal(String goalId, String userId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found with id: " + goalId)
                );

        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this goal");
        }

        goalRepository.deleteById(goalId);
    }

    public void updateGoalProgress(String userId, List<Goal> goals, List<com.fittrack.activityservice.model.Activity> activities) {

        for (Goal goal : goals) {

            int currentValue = 0;

            if ("ACTIVITIES".equalsIgnoreCase(goal.getGoalType())) {

                currentValue = activities.size();

            } else if ("DURATION".equalsIgnoreCase(goal.getGoalType())) {

                currentValue = activities.stream()
                        .filter(activity -> activity.getDuration() != null)
                        .mapToInt(com.fittrack.activityservice.model.Activity::getDuration)
                        .sum();

            } else if ("CALORIES".equalsIgnoreCase(goal.getGoalType())) {

                currentValue = activities.stream()
                        .filter(activity -> activity.getCaloriesBurned() != null)
                        .mapToInt(com.fittrack.activityservice.model.Activity::getCaloriesBurned)
                        .sum();
            }

            goal.setCurrentValue(currentValue);

            if (currentValue >= goal.getTargetValue()) {
                goal.setCompleted(true);
            } else {
                goal.setCompleted(false);
            }

            goalRepository.save(goal);
        }
    }


}