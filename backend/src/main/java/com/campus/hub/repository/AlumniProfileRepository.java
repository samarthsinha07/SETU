package com.campus.hub.repository;

import com.campus.hub.entity.AlumniProfile;
import com.campus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {
    Optional<AlumniProfile> findByUser(User user);
    Optional<AlumniProfile> findByUserId(Long userId);
    List<AlumniProfile> findByIsAcceptingReferralsTrue();

    @Query("SELECT a FROM AlumniProfile a WHERE " +
           "(:company IS NULL OR LOWER(a.currentCompany) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "a.isAcceptingReferrals = true")
    List<AlumniProfile> searchAlumni(@Param("company") String company);
}
