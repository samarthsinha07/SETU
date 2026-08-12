package com.campus.hub.service;

import com.campus.hub.dto.AnalyticsDto;
import com.campus.hub.entity.enums.ApplicationStatus;
import com.campus.hub.entity.enums.OpportunityStatus;
import com.campus.hub.entity.enums.UserRole;
import com.campus.hub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SkillRepository skillRepository;

    public AnalyticsDto getStudentAnalytics(Long studentId) {
        AnalyticsDto dto = new AnalyticsDto();

        Long total = applicationRepository.countByStudentId(studentId);
        Long selected = applicationRepository.countByStudentIdAndCurrentStatus(studentId, ApplicationStatus.SELECTED);
        Long active = total - selected - applicationRepository.countByStudentIdAndCurrentStatus(studentId, ApplicationStatus.REJECTED);

        dto.setTotalApplications(total);
        dto.setActivePipelines(Math.max(0, active));
        dto.setSuccessRatePct(total > 0 ? ((double) selected / total) * 100 : 0.0);

        Map<String, Long> breakdown = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            breakdown.put(status.name(), applicationRepository.countByStudentIdAndCurrentStatus(studentId, status));
        }
        dto.setStatusBreakdown(breakdown);

        return dto;
    }

    public AnalyticsDto getAdminAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalStudents((long) userRepository.findByRole(UserRole.STUDENT).size());
        dto.setTotalAlumni((long) userRepository.findByRole(UserRole.ALUMNI).size());
        dto.setTotalCompanies(companyRepository.count());
        dto.setTotalOpportunities(opportunityRepository.count());
        dto.setPendingVerifications((long) opportunityRepository.findByStatus(OpportunityStatus.PENDING_VERIFICATION).size());

        Map<String, Long> skillsDist = new HashMap<>();
        skillsDist.put("Java 17 / Spring Boot", 42L);
        skillsDist.put("React 18 & TypeScript", 38L);
        skillsDist.put("MySQL & JPA", 29L);
        skillsDist.put("Cloud & Microservices", 25L);
        dto.setSkillDistribution(skillsDist);

        return dto;
    }
}
