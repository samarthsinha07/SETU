package com.campus.hub.controller;

import com.campus.hub.dto.ApiResponse;
import com.campus.hub.dto.ReferralRequestDto;
import com.campus.hub.entity.enums.ReferralStatus;
import com.campus.hub.service.ReferralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    @Autowired
    private ReferralService referralService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ReferralRequestDto>>> getStudentReferrals(@PathVariable Long studentId) {
        List<ReferralRequestDto> requests = referralService.getRequestsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student referral requests fetched", requests));
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<ApiResponse<List<ReferralRequestDto>>> getAlumniReferrals(@PathVariable Long alumniId) {
        List<ReferralRequestDto> requests = referralService.getRequestsByAlumni(alumniId);
        return ResponseEntity.ok(ApiResponse.success("Alumni referral requests fetched", requests));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReferralRequestDto>> requestReferral(
            @RequestParam Long studentId,
            @RequestParam Long alumniId,
            @RequestParam(required = false) Long opportunityId,
            @RequestBody String message) {
        ReferralRequestDto req = referralService.createReferralRequest(studentId, alumniId, opportunityId, message);
        return ResponseEntity.ok(ApiResponse.success("Referral request sent successfully", req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReferralRequestDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam ReferralStatus status,
            @RequestParam(required = false) String feedbackNotes) {
        ReferralRequestDto req = referralService.updateReferralStatus(id, status, feedbackNotes);
        return ResponseEntity.ok(ApiResponse.success("Referral status updated to " + status, req));
    }
}
