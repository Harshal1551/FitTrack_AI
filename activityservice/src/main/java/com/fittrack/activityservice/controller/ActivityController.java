package com.fittrack.activityservice.controller;

import com.fittrack.activityservice.dto.ActivityRequest;
import com.fittrack.activityservice.dto.ActivityResponse;
import com.fittrack.activityservice.dto.ActivityStatsResponse;
import com.fittrack.activityservice.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

    @PostMapping()
    public ResponseEntity<ActivityResponse> trackActivity(
            @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(activityService.trackActivity(request, userId));
    }

    @GetMapping()
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-User-ID") String userId ){
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId ){
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }

    @GetMapping("/stats")
    public ResponseEntity<ActivityStatsResponse> getActivityStats(
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(activityService.getActivityStats(userId));
    }


}
