package com.fittrack.userservice.service;

import com.fittrack.userservice.dto.RegisterRequest;
import com.fittrack.userservice.dto.UpdateProfileRequest;
import com.fittrack.userservice.dto.UserResponse;
import com.fittrack.userservice.model.User;
import com.fittrack.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserResponse register(@Valid RegisterRequest request) {

        if (repository.existsByEmail(request.getEmail())) {

            User existingUser = repository.findByEmail(request.getEmail());

            existingUser.setKeycloakId(request.getKeycloakId());

            User savedUser = repository.save(existingUser);

            return mapToUserResponse(savedUser);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);

        return mapToUserResponse(savedUser);
    }

    public UserResponse getUserProfile(String userId) {

        User user = repository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found: " + userId));

        return mapToUserResponse(user);
    }

    public UserResponse getUserProfileByKeycloakId(String keycloakId) {

        User user = repository.findByKeycloakId(keycloakId);

        if (user == null) {
            throw new RuntimeException(
                    "User Not Found: " + keycloakId);
        }

        return mapToUserResponse(user);
    }

    public UserResponse updateProfile(
            String keycloakId,
            @Valid UpdateProfileRequest request) {

        User user = repository.findByKeycloakId(keycloakId);

        if (user == null) {
            throw new RuntimeException(
                    "User Not Found: " + keycloakId);
        }

        if (request.getWeightKg() == null) {
            throw new RuntimeException(
                    "Weight is required to update the profile.");
        }

        user.setWeightKg(request.getWeightKg());

        User savedUser = repository.save(user);

        return mapToUserResponse(savedUser);
    }

    public Boolean existByUserId(String userId) {
        return repository.existsByKeycloakId(userId);
    }

    private UserResponse mapToUserResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setKeycloakId(user.getKeycloakId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setWeightKg(user.getWeightKg());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}
