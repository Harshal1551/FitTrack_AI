package com.fittrack.activityservice.dto;

import lombok.Data;

@Data
public class ActivityStatsResponse {

    private int totalActivities;

    private int totalDuration;

    private int totalCalories;

    private int averageDuration;

    private int averageCalories;

    private int currentStreak;

    private int fitnessScore;
}