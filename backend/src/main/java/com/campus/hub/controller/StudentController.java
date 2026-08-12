package com.campus.hub.controller;

import com.campus.hub.dto.ApiResponse;
import com.campus.hub.dto.StudentProfileDto;
import com.campus.hub.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(@PathVariable Long userId) {
        StudentProfileDto profile = studentService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Student profile fetched", profile));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(
            @PathVariable Long userId,
            @RequestBody StudentProfileDto updateDto) {
        StudentProfileDto updated = studentService.updateProfile(userId, updateDto);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated", updated));
    }
}
