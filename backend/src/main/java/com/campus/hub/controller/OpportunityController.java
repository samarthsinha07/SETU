package com.campus.hub.controller;

import com.campus.hub.dto.ApiResponse;
import com.campus.hub.dto.OpportunityDto;
import com.campus.hub.entity.enums.OpportunityStatus;
import com.campus.hub.entity.enums.OpportunityType;
import com.campus.hub.entity.enums.WorkMode;
import com.campus.hub.service.OpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getAllOpportunities(
            @RequestParam(required = false) OpportunityStatus status,
            @RequestParam(required = false) OpportunityType type,
            @RequestParam(required = false) WorkMode mode,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long userId) {
        List<OpportunityDto> list = opportunityService.getAllOpportunities(status, type, mode, query, userId);
        return ResponseEntity.ok(ApiResponse.success("Opportunities fetched", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityDto>> getOpportunityById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        OpportunityDto opp = opportunityService.getOpportunityById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Opportunity details fetched", opp));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALUMNI')")
    public ResponseEntity<ApiResponse<OpportunityDto>> createOpportunity(
            @RequestBody OpportunityDto dto,
            @RequestParam Long userId) {
        OpportunityDto created = opportunityService.createOpportunity(dto, userId);
        return ResponseEntity.ok(ApiResponse.success("Opportunity posted successfully", created));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OpportunityDto>> updateOpportunityStatus(
            @PathVariable Long id,
            @RequestParam OpportunityStatus status) {
        OpportunityDto updated = opportunityService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Opportunity status updated to " + status, updated));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<Void>> toggleBookmark(
            @PathVariable Long id,
            @RequestParam Long userId) {
        opportunityService.toggleBookmark(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Bookmark updated", null));
    }

    @GetMapping("/bookmarks/{userId}")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getBookmarks(@PathVariable Long userId) {
        List<OpportunityDto> bookmarks = opportunityService.getBookmarksForUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User bookmarks fetched", bookmarks));
    }
}
