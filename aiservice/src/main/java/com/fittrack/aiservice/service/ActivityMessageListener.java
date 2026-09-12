package com.fittrack.aiservice.service;

import com.fittrack.aiservice.model.Activity;
import com.fittrack.aiservice.model.Recommendation;
import com.fittrack.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity){
        log.info("Recieved Activity for processing: {}",activity.getId());
//        log.info("Generated Recommendation: {}",aiService.generateRecommendation(activity));

        Recommendation recommendation = aiService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }
}
