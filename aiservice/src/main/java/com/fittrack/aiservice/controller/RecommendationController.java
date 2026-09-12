package com.fittrack.aiservice.controller;

import com.fittrack.aiservice.model.Recommendation;
import com.fittrack.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecoomendation(@PathVariable String userId){
        return ResponseEntity.ok(recommendationService.getUserRecoomendation(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecoomendation(@PathVariable String activityId){
        return ResponseEntity.ok(recommendationService.getActivityRecoomendation(activityId));
    }


}
