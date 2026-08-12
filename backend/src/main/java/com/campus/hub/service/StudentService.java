package com.campus.hub.service;

import com.campus.hub.dto.StudentProfileDto;
import com.campus.hub.entity.StudentProfile;
import com.campus.hub.entity.User;
import com.campus.hub.entity.UserSkill;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.StudentProfileRepository;
import com.campus.hub.repository.UserRepository;
import com.campus.hub.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    public StudentProfileDto getProfileByUserId(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return mapToDto(profile);
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentProfileDto updateDto) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));

        User user = profile.getUser();
        if (updateDto.getFirstName() != null) user.setFirstName(updateDto.getFirstName());
        if (updateDto.getLastName() != null) user.setLastName(updateDto.getLastName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        if (updateDto.getAvatarUrl() != null) user.setAvatarUrl(updateDto.getAvatarUrl());
        userRepository.save(user);

        if (updateDto.getMajor() != null) profile.setMajor(updateDto.getMajor());
        if (updateDto.getGraduationYear() != null) profile.setGraduationYear(updateDto.getGraduationYear());
        if (updateDto.getGpa() != null) profile.setGpa(updateDto.getGpa());
        if (updateDto.getBio() != null) profile.setBio(updateDto.getBio());
        if (updateDto.getGithubUrl() != null) profile.setGithubUrl(updateDto.getGithubUrl());
        if (updateDto.getLinkedinUrl() != null) profile.setLinkedinUrl(updateDto.getLinkedinUrl());
        if (updateDto.getPortfolioUrl() != null) profile.setPortfolioUrl(updateDto.getPortfolioUrl());
        if (updateDto.getResumeUrl() != null) profile.setResumeUrl(updateDto.getResumeUrl());

        // Calculate Profile Completion %
        int pct = calculateCompletionPercentage(profile, user);
        profile.setProfileCompletionPct(pct);

        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToDto(saved);
    }

    private int calculateCompletionPercentage(StudentProfile profile, User user) {
        int count = 0;
        int total = 8;
        if (user.getFirstName() != null && !user.getFirstName().isBlank()) count++;
        if (profile.getMajor() != null && !profile.getMajor().isBlank()) count++;
        if (profile.getGraduationYear() != null) count++;
        if (profile.getGpa() != null) count++;
        if (profile.getBio() != null && !profile.getBio().isBlank()) count++;
        if (profile.getLinkedinUrl() != null && !profile.getLinkedinUrl().isBlank()) count++;
        if (profile.getGithubUrl() != null && !profile.getGithubUrl().isBlank()) count++;
        if (profile.getResumeUrl() != null && !profile.getResumeUrl().isBlank()) count++;

        return (int) Math.round(((double) count / total) * 100);
    }

    private StudentProfileDto mapToDto(StudentProfile profile) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setEmail(profile.getUser().getEmail());
        dto.setFirstName(profile.getUser().getFirstName());
        dto.setLastName(profile.getUser().getLastName());
        dto.setAvatarUrl(profile.getUser().getAvatarUrl());
        dto.setPhone(profile.getUser().getPhone());
        dto.setMajor(profile.getMajor());
        dto.setGraduationYear(profile.getGraduationYear());
        dto.setGpa(profile.getGpa());
        dto.setBio(profile.getBio());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setPortfolioUrl(profile.getPortfolioUrl());
        dto.setResumeUrl(profile.getResumeUrl());
        dto.setProfileCompletionPct(profile.getProfileCompletionPct());

        List<UserSkill> userSkills = userSkillRepository.findByUserId(profile.getUser().getId());
        dto.setSkills(userSkills.stream().map(s -> s.getSkill().getName()).collect(Collectors.toList()));

        return dto;
    }
}
