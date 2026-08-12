package com.campus.hub.dto;

import com.campus.hub.entity.enums.ReferralStatus;
import java.time.LocalDateTime;

public class ReferralRequestDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentAvatar;
    private String studentMajor;
    private Integer studentGradYear;
    private Long alumniId;
    private String alumniName;
    private String alumniCompany;
    private String alumniDesignation;
    private Long opportunityId;
    private String opportunityTitle;
    private String message;
    private ReferralStatus status;
    private String feedbackNotes;
    private LocalDateTime createdAt;

    public ReferralRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentAvatar() { return studentAvatar; }
    public void setStudentAvatar(String studentAvatar) { this.studentAvatar = studentAvatar; }

    public String getStudentMajor() { return studentMajor; }
    public void setStudentMajor(String studentMajor) { this.studentMajor = studentMajor; }

    public Integer getStudentGradYear() { return studentGradYear; }
    public void setStudentGradYear(Integer studentGradYear) { this.studentGradYear = studentGradYear; }

    public Long getAlumniId() { return alumniId; }
    public void setAlumniId(Long alumniId) { this.alumniId = alumniId; }

    public String getAlumniName() { return alumniName; }
    public void setAlumniName(String alumniName) { this.alumniName = alumniName; }

    public String getAlumniCompany() { return alumniCompany; }
    public void setAlumniCompany(String alumniCompany) { this.alumniCompany = alumniCompany; }

    public String getAlumniDesignation() { return alumniDesignation; }
    public void setAlumniDesignation(String alumniDesignation) { this.alumniDesignation = alumniDesignation; }

    public Long getOpportunityId() { return opportunityId; }
    public void setOpportunityId(Long opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }

    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
