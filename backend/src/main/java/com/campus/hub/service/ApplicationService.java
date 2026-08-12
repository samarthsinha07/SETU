package com.campus.hub.service;

import com.campus.hub.dto.ApplicationDto;
import com.campus.hub.entity.Application;
import com.campus.hub.entity.ApplicationStatusHistory;
import com.campus.hub.entity.Opportunity;
import com.campus.hub.entity.Resume;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.ApplicationStatus;
import com.campus.hub.entity.enums.NotificationType;
import com.campus.hub.exception.BadRequestException;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ApplicationDto> getApplicationsByStudent(Long studentId) {
        List<Application> apps = applicationRepository.findByStudentId(studentId);
        return apps.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByOpportunity(Long opportunityId) {
        List<Application> apps = applicationRepository.findByOpportunityId(opportunityId);
        return apps.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));
        return mapToDto(app);
    }

    @Transactional
    public ApplicationDto applyForOpportunity(Long studentId, Long opportunityId, Long resumeId, String coverLetter) {
        if (applicationRepository.findByStudentIdAndOpportunityId(studentId, opportunityId).isPresent()) {
            throw new BadRequestException("You have already applied for this opportunity.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found: " + studentId));
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found: " + opportunityId));

        Resume resume = null;
        if (resumeId != null) {
            resume = resumeRepository.findById(resumeId).orElse(null);
        }

        Application app = new Application();
        app.setStudent(student);
        app.setOpportunity(opp);
        app.setResume(resume);
        app.setCoverLetter(coverLetter);
        app.setCurrentStatus(ApplicationStatus.APPLIED);

        Application saved = applicationRepository.save(app);

        // Record initial status history
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved, ApplicationStatus.APPLIED, "Submitted application via Campus Opportunity Hub", student
        );
        statusHistoryRepository.save(history);

        // Notify Student
        notificationService.createNotification(
                student,
                "Application Submitted Successfully",
                "Your application for " + opp.getTitle() + " at " + opp.getCompany().getName() + " has been recorded.",
                NotificationType.APPLICATION_UPDATE,
                "/student/applications"
        );

        return mapToDto(saved);
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus newStatus, String notes, Long adminOrRecruiterUserId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        User actor = userRepository.findById(adminOrRecruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + adminOrRecruiterUserId));

        app.setCurrentStatus(newStatus);
        Application saved = applicationRepository.save(app);

        // Record history log entry
        ApplicationStatusHistory history = new ApplicationStatusHistory(saved, newStatus, notes, actor);
        statusHistoryRepository.save(history);

        // Notify Student of status transition
        notificationService.createNotification(
                app.getStudent(),
                "Application Status Shifted to " + newStatus.name(),
                "Your application status for " + app.getOpportunity().getTitle() + " at " + app.getOpportunity().getCompany().getName() + " is now: " + newStatus.name() + ". Notes: " + (notes != null ? notes : "N/A"),
                NotificationType.APPLICATION_UPDATE,
                "/student/applications"
        );

        return mapToDto(saved);
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStudentId(app.getStudent().getId());
        dto.setStudentName(app.getStudent().getFirstName() + " " + app.getStudent().getLastName());
        dto.setStudentEmail(app.getStudent().getEmail());
        dto.setStudentAvatar(app.getStudent().getAvatarUrl());
        dto.setOpportunityId(app.getOpportunity().getId());
        dto.setOpportunityTitle(app.getOpportunity().getTitle());
        dto.setCompanyName(app.getOpportunity().getCompany().getName());
        dto.setCompanyLogoUrl(app.getOpportunity().getCompany().getLogoUrl());
        
        if (app.getResume() != null) {
            dto.setResumeId(app.getResume().getId());
            dto.setResumeUrl(app.getResume().getFileUrl());
        }
        
        dto.setCoverLetter(app.getCoverLetter());
        dto.setCurrentStatus(app.getCurrentStatus());
        dto.setAppliedAt(app.getAppliedAt());

        List<ApplicationStatusHistory> historyList = statusHistoryRepository.findByApplicationIdOrderByCreatedAtDesc(app.getId());
        dto.setHistory(historyList.stream().map(h -> new ApplicationDto.StatusHistoryDto(
                h.getId(),
                h.getStatus(),
                h.getNotes(),
                h.getChangedBy().getFirstName() + " " + h.getChangedBy().getLastName(),
                h.getCreatedAt()
        )).collect(Collectors.toList()));

        return dto;
    }
}
