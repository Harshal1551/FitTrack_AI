package com.fittrack.activityservice.service;

import com.fittrack.activityservice.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class UserValidationService {

    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId){
        try{
            return userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        } catch (WebClientResponseException e) {
            if(e.getStatusCode() == HttpStatus.NOT_FOUND)
                throw new RuntimeException("User Not Found: " + userId );
            else if(e.getStatusCode() == HttpStatus.BAD_REQUEST)
                throw new RuntimeException("Invalid Request: " + userId );

        }
        return false;
    }

    public UserProfileResponse getUserProfile(String userId) {
        try {
            return userServiceWebClient.get()
                    .uri("/api/users/keycloak/{keycloakId}", userId)
                    .retrieve()
                    .bodyToMono(UserProfileResponse.class)
                    .block();

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new RuntimeException("User Not Found: " + userId);
            }

            throw new RuntimeException(
                    "Failed to retrieve user profile: " + userId, e
            );
        }
    }

}
