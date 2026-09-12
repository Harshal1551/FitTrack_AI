package com.fittrack.aiservice.service;

import com.fittrack.aiservice.dto.FitnessCoachRequest;
import com.fittrack.aiservice.dto.FitnessCoachResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class FitnessCoachService {

    private final GeminiService geminiService;
    private final WebClient.Builder webClientBuilder;

    public FitnessCoachResponse getFitnessAdvice(FitnessCoachRequest request) {

        WebClient webClient = webClientBuilder.build();

        String activities = webClient.get()
                .uri("http://localhost:8082/api/activities")
                .header("X-User-ID", request.getUserId())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("ACTIVITIES FROM ACTIVITY SERVICE:");
        System.out.println(activities);

        String prompt = """
                You are an AI personal fitness coach.

                Analyze the following fitness activities of the user:

                %s

                Based on these activities, provide:
                1. A short summary of the user's workout performance.
                2. What the user is doing well.
                3. Two practical suggestions for improvement.
                4. A short motivational message.

                Keep the response concise and easy to understand.
                Do not make medical diagnoses.
                """.formatted(activities);

        String aiResponse = geminiService.getAnswer(prompt);

        return new FitnessCoachResponse(
                request.getUserId(),
                aiResponse
        );
    }
}