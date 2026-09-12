package com.fittrack.aiservice.controller;

import com.fittrack.aiservice.dto.FitnessCoachRequest;
import com.fittrack.aiservice.dto.FitnessCoachResponse;
import com.fittrack.aiservice.service.FitnessCoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coach")
@RequiredArgsConstructor
public class FitnessCoachController {

    private final FitnessCoachService fitnessCoachService;

    @PostMapping("/advice")
    public ResponseEntity<FitnessCoachResponse> getFitnessAdvice(
            @RequestBody FitnessCoachRequest request) {

        return ResponseEntity.ok(
                fitnessCoachService.getFitnessAdvice(request)
        );
    }
}