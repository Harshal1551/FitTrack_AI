package com.fittrack.aiservice.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AdaptiveAIInput {

    private Map<String, Object> activityAnalysis;

    private String behavior;

    private String goalStatus;

    private List<ActivityData> activities;

    private List<Map<String, Object>> goals;
}