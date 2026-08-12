package com.campus.hub.repository;

import com.campus.hub.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);
    Optional<Bookmark> findByUserIdAndOpportunityId(Long userId, Long opportunityId);
    Boolean existsByUserIdAndOpportunityId(Long userId, Long opportunityId);
    void deleteByUserIdAndOpportunityId(Long userId, Long opportunityId);
}
