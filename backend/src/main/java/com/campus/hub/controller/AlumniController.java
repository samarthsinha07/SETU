package com.campus.hub.controller;

import com.campus.hub.dto.AlumniProfileDto;
import com.campus.hub.dto.ApiResponse;
import com.campus.hub.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    @GetMapping("/directory")
    public ResponseEntity<ApiResponse<List<AlumniProfileDto>>> getAllAlumni(
            @RequestParam(required = false) String company) {
        List<AlumniProfileDto> alumni = alumniService.getAllAlumni(company);
        return ResponseEntity.ok(ApiResponse.success("Alumni directory fetched", alumni));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<AlumniProfileDto>> getProfile(@PathVariable Long userId) {
        AlumniProfileDto profile = alumniService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Alumni profile fetched", profile));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<AlumniProfileDto>> updateProfile(
            @PathVariable Long userId,
            @RequestBody AlumniProfileDto updateDto) {
        AlumniProfileDto updated = alumniService.updateProfile(userId, updateDto);
        return ResponseEntity.ok(ApiResponse.success("Alumni profile updated", updated));
    }
}
