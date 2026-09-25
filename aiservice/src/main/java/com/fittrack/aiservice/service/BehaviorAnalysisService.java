package com.fittrack.aiservice.service;

import com.fittrack.aiservice.model.ActivityData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BehaviorAnalysisService {

    public String analyzeBehavior(List<ActivityData> activities) {

        if (activities == null || activities.isEmpty()) {
            return "No workout behavior detected because there is no activity data.";
        }

        int totalActivities = activities.size();

        if (totalActivities < 3) {
            return "Low activity behavior detected. The user needs more consistent workouts.";
        }

        if (totalActivities < 7) {
            return "Moderate activity behavior detected. The user is developing a workout routine.";
        }

        if (totalActivities < 15) {
            return "Consistent activity behavior detected. The user is maintaining a regular workout routine.";
        }

        return "High activity behavior detected. The user has a strong workout history.";
    }
}