package com.campus.hub.dto;

import java.util.Map;

public class AnalyticsDto {

    // Student Analytics
    private Long totalApplications;
    private Long activePipelines;
    private Double successRatePct;
    private Map<String, Long> statusBreakdown;

    // Admin Analytics
    private Long totalUsers;
    private Long totalStudents;
    private Long totalAlumni;
    private Long totalCompanies;
    private Long totalOpportunities;
    private Long pendingVerifications;
    private Map<String, Long> skillDistribution;

    public AnalyticsDto() {}

    public Long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(Long totalApplications) { this.totalApplications = totalApplications; }

    public Long getActivePipelines() { return activePipelines; }
    public void setActivePipelines(Long activePipelines) { this.activePipelines = activePipelines; }

    public Double getSuccessRatePct() { return successRatePct; }
    public void setSuccessRatePct(Double successRatePct) { this.successRatePct = successRatePct; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalAlumni() { return totalAlumni; }
    public void setTotalAlumni(Long totalAlumni) { this.totalAlumni = totalAlumni; }

    public Long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(Long totalCompanies) { this.totalCompanies = totalCompanies; }

    public Long getTotalOpportunities() { return totalOpportunities; }
    public void setTotalOpportunities(Long totalOpportunities) { this.totalOpportunities = totalOpportunities; }

    public Long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(Long pendingVerifications) { this.pendingVerifications = pendingVerifications; }

    public Map<String, Long> getSkillDistribution() { return skillDistribution; }
    public void setSkillDistribution(Map<String, Long> skillDistribution) { this.skillDistribution = skillDistribution; }
}
