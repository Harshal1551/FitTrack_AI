package com.fittrack.aiservice.model;

import lombok.Data;

import java.util.List;

@Data
public class AdaptivePlanResponse {

    private String analysis;
    private String behavior;
    private String goalStatus;
    private List<DailyPlan> weeklyPlan;
    private List<String> suggestions;

    @Data
    public static class DailyPlan {

        private String day;
        private String activity;
        private int duration;
        private String reason;
    }
}