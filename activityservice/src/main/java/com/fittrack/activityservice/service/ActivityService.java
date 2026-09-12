package com.fittrack.activityservice.service;

import com.fittrack.activityservice.dto.ActivityRequest;
import com.fittrack.activityservice.dto.ActivityResponse;
import com.fittrack.activityservice.dto.ActivityStatsResponse;
import com.fittrack.activityservice.model.Activity;
import com.fittrack.activityservice.model.Goal;
import com.fittrack.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;
    private final GoalService goalService;


    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request, String userId) {

        boolean isValidUser = userValidationService.validateUser(userId);

        if(!isValidUser){
            throw new RuntimeException("Invalid User: " + userId);
        }

        Activity activity = Activity.builder()
                .userId(userId)
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        List<Goal> goals = goalService.getUserGoals(userId);

        List<Activity> userActivities = activityRepository.findByUserId(userId);

        goalService.updateGoalProgress(
                userId,
                goals,
                userActivities
        );

        // Publish to RabbitMQ for AI Processing
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch (Exception e) {
            log.error("Failed to publish activity to RabbitMQ : ", e);
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {

        ActivityResponse response = new ActivityResponse();

        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());

        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
       List<Activity> activities = activityRepository.findByUserId(userId);

        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }

    public ActivityStatsResponse getActivityStats(String userId) {

        List<Activity> activities = activityRepository.findByUserId(userId);

        ActivityStatsResponse stats = new ActivityStatsResponse();

        int totalActivities = activities.size();

        int totalDuration = activities.stream()
                .mapToInt(Activity::getDuration)
                .sum();

        int totalCalories = activities.stream()
                .mapToInt(Activity::getCaloriesBurned)
                .sum();

        int averageDuration = totalActivities == 0
                ? 0
                : totalDuration / totalActivities;

        int averageCalories = totalActivities == 0
                ? 0
                : totalCalories / totalActivities;

        stats.setTotalActivities(totalActivities);
        stats.setTotalDuration(totalDuration);
        stats.setTotalCalories(totalCalories);
        stats.setAverageDuration(averageDuration);
        stats.setAverageCalories(averageCalories);

        // Calculate fitness score out of 100
        int fitnessScore = 0;

        if (totalActivities > 0) {
            int activityScore = Math.min(totalActivities * 10, 30);
            int durationScore = Math.min(totalDuration / 10, 30);
            int calorieScore = Math.min(totalCalories / 100, 20);
            int consistencyScore = Math.min(averageDuration / 5, 20);

            fitnessScore = activityScore
                    + durationScore
                    + calorieScore
                    + consistencyScore;
        }

        stats.setFitnessScore(fitnessScore);

        return stats;
    }
}