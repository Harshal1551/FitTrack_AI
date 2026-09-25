package com.fittrack.aiservice.controller;

import com.fittrack.aiservice.model.AdaptivePlanResponse;
import com.fittrack.aiservice.service.AdaptivePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adaptive")
@RequiredArgsConstructor
public class AdaptivePlanController {

    private final AdaptivePlanService adaptivePlanService;

    @GetMapping("/plan")
    public ResponseEntity<AdaptivePlanResponse> generateAdaptivePlan(
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(
                adaptivePlanService.generateAdaptivePlan(userId)
        );
    }
}