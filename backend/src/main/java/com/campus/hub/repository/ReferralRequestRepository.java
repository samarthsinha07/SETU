package com.campus.hub.repository;

import com.campus.hub.entity.ReferralRequest;
import com.campus.hub.entity.enums.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralRequestRepository extends JpaRepository<ReferralRequest, Long> {
    List<ReferralRequest> findByStudentId(Long studentId);
    List<ReferralRequest> findByAlumniId(Long alumniId);
    List<ReferralRequest> findByAlumniIdAndStatus(Long alumniId, ReferralStatus status);
}
