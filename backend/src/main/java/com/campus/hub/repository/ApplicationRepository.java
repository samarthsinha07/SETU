package com.campus.hub.repository;

import com.campus.hub.entity.Application;
import com.campus.hub.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByOpportunityId(Long opportunityId);
    Optional<Application> findByStudentIdAndOpportunityId(Long studentId, Long opportunityId);
    Long countByStudentIdAndCurrentStatus(Long studentId, ApplicationStatus status);
    Long countByStudentId(Long studentId);
}
