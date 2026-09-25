package com.fittrack.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;


    public GeminiService(
            WebClient.Builder webClientBuilder,
            ObjectMapper objectMapper) {

        this.webClient = webClientBuilder
                .build();

        this.objectMapper = objectMapper;
    }


    public String getAnswer(String question) {

        Map<String, Object> requestBody = Map.of(

                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", question)
                                }
                        )
                },

                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "maxOutputTokens", 1200
                )
        );


        try {

            String response = webClient.post()

                    .uri(geminiApiUrl)

                    .header(
                            "x-goog-api-key",
                            geminiApiKey
                    )

                    .header(
                            "Content-Type",
                            "application/json"
                    )

                    .bodyValue(requestBody)

                    .retrieve()

                    .bodyToMono(String.class)

                    // Maximum time allowed for one Gemini request
                    .timeout(Duration.ofSeconds(20))

                    // Retry only once for temporary 503 errors
                    .retryWhen(
                            Retry.backoff(
                                            1,
                                            Duration.ofSeconds(1)
                                    )
                                    .filter(
                                            ex -> ex instanceof
                                                    WebClientResponseException.ServiceUnavailable
                                    )
                    )

                    .block();


            return extractText(response);


        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini AI request failed: " + e.getMessage(),
                    e
            );
        }
    }


    private String extractText(String response) {

        try {

            JsonNode root =
                    objectMapper.readTree(response);


            JsonNode textNode = root
                    .path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");


            if (textNode.isMissingNode() ||
                    textNode.asText().isBlank()) {

                throw new RuntimeException(
                        "Gemini returned an empty response"
                );
            }


            return textNode.asText();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini response",
                    e
            );
        }
    }
}