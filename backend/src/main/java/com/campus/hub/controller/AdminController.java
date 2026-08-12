package com.campus.hub.controller;

import com.campus.hub.dto.ApiResponse;
import com.campus.hub.dto.AuditLogDto;
import com.campus.hub.dto.OpportunityDto;
import com.campus.hub.entity.Company;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.OpportunityStatus;
import com.campus.hub.entity.enums.UserStatus;
import com.campus.hub.service.AdminService;
import com.campus.hub.service.OpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OpportunityService opportunityService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam UserStatus status,
            @RequestParam Long adminId) {
        User user = adminService.updateUserStatus(userId, status, adminId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }

    @PatchMapping("/companies/{companyId}/verify")
    public ResponseEntity<ApiResponse<Company>> verifyCompany(
            @PathVariable Long companyId,
            @RequestParam Boolean verified,
            @RequestParam Long adminId) {
        Company company = adminService.verifyCompany(companyId, verified, adminId);
        return ResponseEntity.ok(ApiResponse.success("Company verification updated", company));
    }

    @GetMapping("/opportunities/pending")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getPendingOpportunities() {
        List<OpportunityDto> pending = opportunityService.getAllOpportunities(
                OpportunityStatus.PENDING_VERIFICATION, null, null, null, null);
        return ResponseEntity.ok(ApiResponse.success("Pending opportunities fetched", pending));
    }

    @PatchMapping("/opportunities/{id}/verify")
    public ResponseEntity<ApiResponse<OpportunityDto>> verifyOpportunity(
            @PathVariable Long id,
            @RequestParam OpportunityStatus status) {
        OpportunityDto opp = opportunityService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Opportunity status updated to " + status, opp));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        List<AuditLogDto> logs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("Audit logs fetched", logs));
    }
}
