package com.fittrack.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "goals")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Goal {

    @Id
    private String id;

    private String userId;

    private String goalType;

    private Integer targetValue;

    private Integer currentValue;

    private String unit;

    private LocalDateTime startDate;

    private LocalDateTime targetDate;

    private boolean completed;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}