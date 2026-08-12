package com.campus.hub.service;

import com.campus.hub.dto.AlumniProfileDto;
import com.campus.hub.entity.AlumniProfile;
import com.campus.hub.entity.User;
import com.campus.hub.entity.UserSkill;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.AlumniProfileRepository;
import com.campus.hub.repository.UserRepository;
import com.campus.hub.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumniService {

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    public AlumniProfileDto getProfileByUserId(Long userId) {
        AlumniProfile profile = alumniProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found for user id: " + userId));
        return mapToDto(profile);
    }

    public List<AlumniProfileDto> getAllAlumni(String company) {
        List<AlumniProfile> alumniList = alumniProfileRepository.searchAlumni(company);
        return alumniList.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public AlumniProfileDto updateProfile(Long userId, AlumniProfileDto updateDto) {
        AlumniProfile profile = alumniProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found for user id: " + userId));

        User user = profile.getUser();
        if (updateDto.getFirstName() != null) user.setFirstName(updateDto.getFirstName());
        if (updateDto.getLastName() != null) user.setLastName(updateDto.getLastName());
        if (updateDto.getAvatarUrl() != null) user.setAvatarUrl(updateDto.getAvatarUrl());
        userRepository.save(user);

        if (updateDto.getCurrentCompany() != null) profile.setCurrentCompany(updateDto.getCurrentCompany());
        if (updateDto.getDesignation() != null) profile.setDesignation(updateDto.getDesignation());
        if (updateDto.getTotalExperienceYears() != null) profile.setTotalExperienceYears(updateDto.getTotalExperienceYears());
        if (updateDto.getLinkedinUrl() != null) profile.setLinkedinUrl(updateDto.getLinkedinUrl());
        if (updateDto.getBio() != null) profile.setBio(updateDto.getBio());
        if (updateDto.getReferralSlotsAvailable() != null) profile.setReferralSlotsAvailable(updateDto.getReferralSlotsAvailable());
        if (updateDto.getIsAcceptingReferrals() != null) profile.setIsAcceptingReferrals(updateDto.getIsAcceptingReferrals());

        AlumniProfile saved = alumniProfileRepository.save(profile);
        return mapToDto(saved);
    }

    private AlumniProfileDto mapToDto(AlumniProfile profile) {
        AlumniProfileDto dto = new AlumniProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setEmail(profile.getUser().getEmail());
        dto.setFirstName(profile.getUser().getFirstName());
        dto.setLastName(profile.getUser().getLastName());
        dto.setAvatarUrl(profile.getUser().getAvatarUrl());
        
        if (profile.getCompany() != null) {
            dto.setCompanyId(profile.getCompany().getId());
            dto.setCompanyLogoUrl(profile.getCompany().getLogoUrl());
        }
        
        dto.setCurrentCompany(profile.getCurrentCompany());
        dto.setDesignation(profile.getDesignation());
        dto.setTotalExperienceYears(profile.getTotalExperienceYears());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setBio(profile.getBio());
        dto.setReferralSlotsAvailable(profile.getReferralSlotsAvailable());
        dto.setIsAcceptingReferrals(profile.getIsAcceptingReferrals());

        List<UserSkill> userSkills = userSkillRepository.findByUserId(profile.getUser().getId());
        dto.setSkills(userSkills.stream().map(s -> s.getSkill().getName()).collect(Collectors.toList()));

        return dto;
    }
}
