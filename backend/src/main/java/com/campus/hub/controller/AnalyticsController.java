package com.campus.hub.controller;

import com.campus.hub.dto.AnalyticsDto;
import com.campus.hub.dto.ApiResponse;
import com.campus.hub.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getStudentAnalytics(@PathVariable Long studentId) {
        AnalyticsDto analytics = analyticsService.getStudentAnalytics(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student analytics fetched", analytics));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAdminAnalytics() {
        AnalyticsDto analytics = analyticsService.getAdminAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Admin analytics fetched", analytics));
    }
}
