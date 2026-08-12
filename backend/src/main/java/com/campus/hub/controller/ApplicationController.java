package com.campus.hub.controller;

import com.campus.hub.dto.ApiResponse;
import com.campus.hub.dto.ApplicationDto;
import com.campus.hub.entity.enums.ApplicationStatus;
import com.campus.hub.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getStudentApplications(@PathVariable Long studentId) {
        List<ApplicationDto> apps = applicationService.getApplicationsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student applications fetched", apps));
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getOpportunityApplications(@PathVariable Long opportunityId) {
        List<ApplicationDto> apps = applicationService.getApplicationsByOpportunity(opportunityId);
        return ResponseEntity.ok(ApiResponse.success("Opportunity applications fetched", apps));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(@PathVariable Long id) {
        ApplicationDto app = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success("Application details fetched", app));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(
            @RequestParam Long studentId,
            @RequestParam Long opportunityId,
            @RequestParam(required = false) Long resumeId,
            @RequestBody(required = false) String coverLetter) {
        ApplicationDto app = applicationService.applyForOpportunity(studentId, opportunityId, resumeId, coverLetter);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", app));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String notes,
            @RequestParam Long adminOrRecruiterUserId) {
        ApplicationDto app = applicationService.updateApplicationStatus(id, status, notes, adminOrRecruiterUserId);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", app));
    }
}
