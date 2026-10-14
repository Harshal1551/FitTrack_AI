package com.fittrack.userservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String id;
    private String keycloakId;
    private String email;
    private String firstName;
    private String lastName;
    private Double weightKg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}