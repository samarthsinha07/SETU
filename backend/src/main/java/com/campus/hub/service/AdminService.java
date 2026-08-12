package com.campus.hub.service;

import com.campus.hub.dto.AuditLogDto;
import com.campus.hub.entity.AuditLog;
import com.campus.hub.entity.Company;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.UserStatus;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.AuditLogRepository;
import com.campus.hub.repository.CompanyRepository;
import com.campus.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserStatus(Long userId, UserStatus status, Long adminUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setStatus(status);
        User saved = userRepository.save(user);

        logAudit(adminUserId, "UPDATE_USER_STATUS", "USER", userId, "Updated user " + user.getEmail() + " status to " + status);
        return saved;
    }

    @Transactional
    public Company verifyCompany(Long companyId, Boolean verifyStatus, Long adminUserId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        company.setIsVerified(verifyStatus);
        Company saved = companyRepository.save(company);

        logAudit(adminUserId, "VERIFY_COMPANY", "COMPANY", companyId, (verifyStatus ? "Verified" : "Unverified") + " company " + company.getName());
        return saved;
    }

    public List<AuditLogDto> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        return logs.stream().map(l -> {
            AuditLogDto dto = new AuditLogDto();
            dto.setId(l.getId());
            if (l.getUser() != null) {
                dto.setUserId(l.getUser().getId());
                dto.setUserName(l.getUser().getFirstName() + " " + l.getUser().getLastName());
                dto.setUserRole(l.getUser().getRole().name());
            }
            dto.setAction(l.getAction());
            dto.setEntityType(l.getEntityType());
            dto.setEntityId(l.getEntityId());
            dto.setDetails(l.getDetails());
            dto.setIpAddress(l.getIpAddress());
            dto.setTimestamp(l.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }

    public void logAudit(Long userId, String action, String entityType, Long entityId, String details) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        AuditLog audit = new AuditLog(user, action, entityType, entityId, details, "127.0.0.1");
        auditLogRepository.save(audit);
    }
}
