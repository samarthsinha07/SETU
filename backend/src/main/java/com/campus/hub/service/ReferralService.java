package com.campus.hub.service;

import com.campus.hub.dto.ReferralRequestDto;
import com.campus.hub.entity.*;
import com.campus.hub.entity.enums.NotificationType;
import com.campus.hub.entity.enums.ReferralStatus;
import com.campus.hub.exception.BadRequestException;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferralService {

    @Autowired
    private ReferralRequestRepository referralRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ReferralRequestDto> getRequestsByStudent(Long studentId) {
        return referralRequestRepository.findByStudentId(studentId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ReferralRequestDto> getRequestsByAlumni(Long alumniId) {
        return referralRequestRepository.findByAlumniId(alumniId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ReferralRequestDto createReferralRequest(Long studentId, Long alumniId, Long opportunityId, String message) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found"));
        User alumni = userRepository.findById(alumniId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni user not found"));

        AlumniProfile alumniProfile = alumniProfileRepository.findByUserId(alumniId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found"));

        if (!alumniProfile.getIsAcceptingReferrals() || alumniProfile.getReferralSlotsAvailable() <= 0) {
            throw new BadRequestException("Selected Alumni is currently not accepting new referral requests.");
        }

        Opportunity opp = null;
        if (opportunityId != null) {
            opp = opportunityRepository.findById(opportunityId).orElse(null);
        }

        ReferralRequest req = new ReferralRequest();
        req.setStudent(student);
        req.setAlumni(alumni);
        req.setOpportunity(opp);
        req.setMessage(message);
        req.setStatus(ReferralStatus.REQUESTED);

        ReferralRequest saved = referralRequestRepository.save(req);

        // Notify Alumni
        notificationService.createNotification(
                alumni,
                "New Inbound Referral Request",
                student.getFirstName() + " " + student.getLastName() + " requested a referral for " + (opp != null ? opp.getTitle() : "general positions"),
                NotificationType.REFERRAL_UPDATE,
                "/alumni/referrals"
        );

        return mapToDto(saved);
    }

    @Transactional
    public ReferralRequestDto updateReferralStatus(Long requestId, ReferralStatus newStatus, String feedbackNotes) {
        ReferralRequest req = referralRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Referral request not found: " + requestId));

        req.setStatus(newStatus);
        if (feedbackNotes != null) {
            req.setFeedbackNotes(feedbackNotes);
        }

        // Adjust slots if accepted/referred
        if (newStatus == ReferralStatus.ACCEPTED || newStatus == ReferralStatus.REFERRED) {
            AlumniProfile alumniProfile = alumniProfileRepository.findByUserId(req.getAlumni().getId()).orElse(null);
            if (alumniProfile != null && alumniProfile.getReferralSlotsAvailable() > 0) {
                alumniProfile.setReferralSlotsAvailable(alumniProfile.getReferralSlotsAvailable() - 1);
                alumniProfileRepository.save(alumniProfile);
            }
        }

        ReferralRequest saved = referralRequestRepository.save(req);

        // Notify Student
        notificationService.createNotification(
                req.getStudent(),
                "Referral Request Updated: " + newStatus.name(),
                req.getAlumni().getFirstName() + " " + req.getAlumni().getLastName() + " updated your referral request to: " + newStatus.name(),
                NotificationType.REFERRAL_UPDATE,
                "/student/referrals"
        );

        return mapToDto(saved);
    }

    private ReferralRequestDto mapToDto(ReferralRequest req) {
        ReferralRequestDto dto = new ReferralRequestDto();
        dto.setId(req.getId());
        dto.setStudentId(req.getStudent().getId());
        dto.setStudentName(req.getStudent().getFirstName() + " " + req.getStudent().getLastName());
        dto.setStudentEmail(req.getStudent().getEmail());
        dto.setStudentAvatar(req.getStudent().getAvatarUrl());

        StudentProfile sp = studentProfileRepository.findByUserId(req.getStudent().getId()).orElse(null);
        if (sp != null) {
            dto.setStudentMajor(sp.getMajor());
            dto.setStudentGradYear(sp.getGraduationYear());
        }

        dto.setAlumniId(req.getAlumni().getId());
        dto.setAlumniName(req.getAlumni().getFirstName() + " " + req.getAlumni().getLastName());

        AlumniProfile ap = alumniProfileRepository.findByUserId(req.getAlumni().getId()).orElse(null);
        if (ap != null) {
            dto.setAlumniCompany(ap.getCurrentCompany());
            dto.setAlumniDesignation(ap.getDesignation());
        }

        if (req.getOpportunity() != null) {
            dto.setOpportunityId(req.getOpportunity().getId());
            dto.setOpportunityTitle(req.getOpportunity().getTitle());
        }

        dto.setMessage(req.getMessage());
        dto.setStatus(req.getStatus());
        dto.setFeedbackNotes(req.getFeedbackNotes());
        dto.setCreatedAt(req.getCreatedAt());

        return dto;
    }
}
