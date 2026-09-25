package com.fittrack.aiservice.service;

import com.fittrack.aiservice.model.ActivityData;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityPatternAnalyzer {

    public Map<String, Object> analyze(List<ActivityData> activities) {

        Map<String, Object> analysis = new HashMap<>();

        if (activities == null || activities.isEmpty()) {
            analysis.put("totalActivities", 0);
            analysis.put("totalDuration", 0);
            analysis.put("totalCalories", 0);
            analysis.put("averageDuration", 0);
            analysis.put("averageCalories", 0);
            analysis.put("mostCommonActivity", "NONE");
            analysis.put("activityVariety", 0);

            return analysis;
        }

        int totalDuration = 0;
        int totalCalories = 0;

        Map<String, Integer> activityCount = new HashMap<>();

        for (ActivityData activity : activities) {

            if (activity.getDuration() != null) {
                totalDuration += activity.getDuration();
            }

            if (activity.getCaloriesBurned() != null) {
                totalCalories += activity.getCaloriesBurned();
            }

            if (activity.getType() != null) {
                activityCount.merge(
                        activity.getType(),
                        1,
                        Integer::sum
                );
            }
        }

        String mostCommonActivity = activityCount.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("NONE");

        int averageDuration =
                totalDuration / activities.size();

        int averageCalories =
                totalCalories / activities.size();

        analysis.put("totalActivities", activities.size());
        analysis.put("totalDuration", totalDuration);
        analysis.put("totalCalories", totalCalories);
        analysis.put("averageDuration", averageDuration);
        analysis.put("averageCalories", averageCalories);
        analysis.put("mostCommonActivity", mostCommonActivity);
        analysis.put("activityVariety", activityCount.size());

        return analysis;
    }
}