package com.fittrack.aiservice.service;

import com.fittrack.aiservice.model.Recommendation;
import com.fittrack.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecoomendation(String userId) {
       return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecoomendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for this activity: " + activityId));
    }
}
