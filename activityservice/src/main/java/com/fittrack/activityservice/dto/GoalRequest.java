package com.fittrack.activityservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GoalRequest {

    private String goalType;

    private Integer targetValue;

    private String unit;

    private LocalDateTime startDate;

    private LocalDateTime targetDate;
}