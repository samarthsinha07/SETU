package com.campus.hub.dto;

import java.util.List;

public class AlumniProfileDto {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private Long companyId;
    private String currentCompany;
    private String companyLogoUrl;
    private String designation;
    private Integer totalExperienceYears;
    private String linkedinUrl;
    private String bio;
    private Integer referralSlotsAvailable;
    private Boolean isAcceptingReferrals;
    private List<String> skills;

    public AlumniProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

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

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}
