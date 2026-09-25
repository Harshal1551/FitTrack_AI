package com.fittrack.aiservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittrack.aiservice.model.ActivityData;
import com.fittrack.aiservice.model.AdaptiveAIInput;
import com.fittrack.aiservice.model.AdaptivePlanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdaptivePlanService {

    private final RestClient restClient;
    private final ActivityPatternAnalyzer activityPatternAnalyzer;
    private final BehaviorAnalysisService behaviorAnalysisService;
    private final GoalRiskAnalysisService goalRiskAnalysisService;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;


    public AdaptivePlanResponse generateAdaptivePlan(String userId) {

        // 1. Get user's activities
        List<ActivityData> activities = getUserActivities(userId);


        // 2. Get user's goals
        List<Map<String, Object>> goals = getUserGoals(userId);


        // 3. Analyze activity patterns
        Map<String, Object> patternAnalysis =
                activityPatternAnalyzer.analyze(activities);


        // 4. Analyze behavior
        String behavior =
                behaviorAnalysisService.analyzeBehavior(activities);


        // 5. Analyze goal risk
        String goalStatus =
                goalRiskAnalysisService.analyzeGoalRisk(goals);


        // 6. Create AI input
        AdaptiveAIInput aiInput = new AdaptiveAIInput();

        aiInput.setActivities(activities);
        aiInput.setGoals(goals);
        aiInput.setActivityAnalysis(patternAnalysis);
        aiInput.setBehavior(behavior);
        aiInput.setGoalStatus(goalStatus);


        // 7. Create Gemini prompt
        String prompt = createAdaptivePlanPrompt(aiInput);


        // 8. Ask Gemini
        String aiResponse = geminiService.getAnswer(prompt);


        System.out.println("========== ADAPTIVE AI RESPONSE ==========");
        System.out.println(aiResponse);
        System.out.println("===========================================");


        // 9. Convert Gemini JSON response
        try {

            String cleanJson = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();


            AdaptivePlanResponse response =
                    objectMapper.readValue(
                            cleanJson,
                            AdaptivePlanResponse.class
                    );


            // 10. Validate weekly plan
            if (response.getWeeklyPlan() == null ||
                    response.getWeeklyPlan().size() != 7) {

                throw new RuntimeException(
                        "Gemini generated an invalid weekly plan. " +
                                "Expected exactly 7 days."
                );
            }


            // 11. Validate suggestions
            if (response.getSuggestions() == null ||
                    response.getSuggestions().isEmpty()) {

                throw new RuntimeException(
                        "Gemini generated no suggestions."
                );
            }


            // 12. Return final response
            return response;


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to convert Gemini response into AdaptivePlanResponse",
                    e
            );
        }
    }


    // =========================================================
    // GET USER ACTIVITIES
    // =========================================================

    private List<ActivityData> getUserActivities(String userId) {

        ActivityData[] activities = restClient.get()
                .uri("http://localhost:8082/api/activities")
                .header("X-User-ID", userId)
                .retrieve()
                .body(ActivityData[].class);


        return activities != null
                ? Arrays.asList(activities)
                : List.of();
    }


    // =========================================================
    // GET USER GOALS
    // =========================================================

    private List<Map<String, Object>> getUserGoals(String userId) {

        List<Map<String, Object>> goals = restClient.get()
                .uri("http://localhost:8082/api/goals")
                .header("X-User-ID", userId)
                .retrieve()
                .body(
                        new ParameterizedTypeReference<
                                List<Map<String, Object>>>() {
                        }
                );


        return goals != null
                ? goals
                : List.of();
    }


    // =========================================================
    // CREATE GEMINI PROMPT
    // =========================================================

    private String createAdaptivePlanPrompt(
            AdaptiveAIInput input) {

        return """
                You are an AI Adaptive Fitness Intelligence system.

                Analyze the user's fitness history, activity patterns,
                behavior, and goals.

                Your job is to identify meaningful patterns and prepare
                an adaptive fitness strategy.


                USER ACTIVITY ANALYSIS:
                %s


                DETECTED BEHAVIOR:
                %s


                GOAL STATUS:
                %s


                RAW ACTIVITIES:
                %s


                USER GOALS:
                %s


                Based on all this information:

                1. Analyze the user's current fitness behavior.
                2. Identify strengths and weaknesses.
                3. Determine whether the user's current behavior supports
                   their goals.
                4. Provide practical suggestions.
                5. Create a personalized 7-day fitness plan.
                6. Adapt the plan according to the user's existing
                   activities and goals.
                7. Do not make medical diagnoses.
                8. Do not recommend dangerous or extreme workouts.


                Return ONLY valid JSON in this exact structure:

                {
                  "analysis": "Detailed analysis of the user's current fitness pattern",
                  "behavior": "Detailed description of the detected behavior",
                  "goalStatus": "Explanation of how current progress relates to goals",
                  "weeklyPlan": [
                    {
                      "day": "Monday",
                      "activity": "Running",
                      "duration": 30,
                      "reason": "Reason for recommending this activity"
                    }
                  ],
                  "suggestions": [
                    "Suggestion 1",
                    "Suggestion 2",
                    "Suggestion 3"
                  ]
                }


                The weeklyPlan must contain exactly 7 days.

                Duration must be in minutes.

                Keep recommendations realistic and personalized.
                """.formatted(
                input.getActivityAnalysis(),
                input.getBehavior(),
                input.getGoalStatus(),
                input.getActivities(),
                input.getGoals()
        );
    }
}