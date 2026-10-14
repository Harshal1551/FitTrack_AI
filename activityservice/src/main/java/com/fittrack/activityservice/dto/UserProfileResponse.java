
package com.fittrack.activityservice.dto;

import lombok.Data;

@Data
public class UserProfileResponse {

    private String id;
    private String keycloakId;
    private String email;
    private String firstName;
    private String lastName;
    private Double weightKg;
}
