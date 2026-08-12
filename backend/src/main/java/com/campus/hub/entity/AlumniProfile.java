package com.campus.hub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alumni_profiles")
public class AlumniProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "current_company", nullable = false, length = 100)
    private String currentCompany;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "total_experience_years", nullable = false)
    private Integer totalExperienceYears = 0;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "referral_slots_available", nullable = false)
    private Integer referralSlotsAvailable = 5;

    @Column(name = "is_accepting_referrals", nullable = false)
    private Boolean isAcceptingReferrals = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public AlumniProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Integer getTotalExperienceYears() { return totalExperienceYears; }
    public void setTotalExperienceYears(Integer totalExperienceYears) { this.totalExperienceYears = totalExperienceYears; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getReferralSlotsAvailable() { return referralSlotsAvailable; }
    public void setReferralSlotsAvailable(Integer referralSlotsAvailable) { this.referralSlotsAvailable = referralSlotsAvailable; }

    public Boolean getIsAcceptingReferrals() { return isAcceptingReferrals; }
    public void setIsAcceptingReferrals(Boolean isAcceptingReferrals) { this.isAcceptingReferrals = isAcceptingReferrals; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
