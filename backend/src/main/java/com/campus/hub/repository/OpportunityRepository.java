package com.campus.hub.repository;

import com.campus.hub.entity.Opportunity;
import com.campus.hub.entity.enums.OpportunityStatus;
import com.campus.hub.entity.enums.OpportunityType;
import com.campus.hub.entity.enums.WorkMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByStatus(OpportunityStatus status);

    @Query("SELECT o FROM Opportunity o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:type IS NULL OR o.opportunityType = :type) AND " +
           "(:mode IS NULL OR o.workMode = :mode) AND " +
           "(:query IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Opportunity> filterOpportunities(
        @Param("status") OpportunityStatus status,
        @Param("type") OpportunityType type,
        @Param("mode") WorkMode mode,
        @Param("query") String query
    );
}
