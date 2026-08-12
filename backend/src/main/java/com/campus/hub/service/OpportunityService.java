package com.campus.hub.service;

import com.campus.hub.dto.OpportunityDto;
import com.campus.hub.entity.Bookmark;
import com.campus.hub.entity.Company;
import com.campus.hub.entity.Opportunity;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.OpportunityStatus;
import com.campus.hub.entity.enums.OpportunityType;
import com.campus.hub.entity.enums.WorkMode;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.BookmarkRepository;
import com.campus.hub.repository.CompanyRepository;
import com.campus.hub.repository.OpportunityRepository;
import com.campus.hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpportunityService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    public List<OpportunityDto> getAllOpportunities(OpportunityStatus status, OpportunityType type, WorkMode mode, String query, Long userId) {
        List<Opportunity> opportunities = opportunityRepository.filterOpportunities(status, type, mode, query);
        return opportunities.stream().map(o -> mapToDto(o, userId)).collect(Collectors.toList());
    }

    public OpportunityDto getOpportunityById(Long id, Long userId) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id: " + id));
        return mapToDto(opportunity, userId);
    }

    @Transactional
    public OpportunityDto createOpportunity(OpportunityDto dto, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Company company;
        if (dto.getCompanyId() != null) {
            company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        } else {
            company = companyRepository.findByName(dto.getCompanyName())
                    .orElseGet(() -> {
                        Company newComp = new Company();
                        newComp.setName(dto.getCompanyName());
                        newComp.setDomain("company.com");
                        newComp.setIndustry("Technology");
                        return companyRepository.save(newComp);
                    });
        }

        Opportunity opportunity = new Opportunity();
        opportunity.setCompany(company);
        opportunity.setTitle(dto.getTitle());
        opportunity.setDescription(dto.getDescription());
        opportunity.setOpportunityType(dto.getOpportunityType());
        opportunity.setLocation(dto.getLocation());
        opportunity.setWorkMode(dto.getWorkMode());
        opportunity.setExperienceLevel(dto.getExperienceLevel());
        opportunity.setSalaryRange(dto.getSalaryRange());
        opportunity.setDeadline(dto.getDeadline());
        opportunity.setStatus(OpportunityStatus.PENDING_VERIFICATION);
        opportunity.setCreatedBy(creator);

        Opportunity saved = opportunityRepository.save(opportunity);
        return mapToDto(saved, userId);
    }

    @Transactional
    public OpportunityDto updateStatus(Long opportunityId, OpportunityStatus newStatus) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found: " + opportunityId));
        opportunity.setStatus(newStatus);
        Opportunity saved = opportunityRepository.save(opportunity);
        return mapToDto(saved, null);
    }

    @Transactional
    public void toggleBookmark(Long userId, Long opportunityId) {
        if (bookmarkRepository.existsByUserIdAndOpportunityId(userId, opportunityId)) {
            bookmarkRepository.deleteByUserIdAndOpportunityId(userId, opportunityId);
        } else {
            User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Opportunity opp = opportunityRepository.findById(opportunityId).orElseThrow(() -> new ResourceNotFoundException("Opportunity not found"));
            bookmarkRepository.save(new Bookmark(user, opp));
        }
    }

    public List<OpportunityDto> getBookmarksForUser(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        return bookmarks.stream()
                .map(b -> mapToDto(b.getOpportunity(), userId))
                .collect(Collectors.toList());
    }

    private OpportunityDto mapToDto(Opportunity o, Long userId) {
        OpportunityDto dto = new OpportunityDto();
        dto.setId(o.getId());
        dto.setCompanyId(o.getCompany().getId());
        dto.setCompanyName(o.getCompany().getName());
        dto.setCompanyLogoUrl(o.getCompany().getLogoUrl());
        dto.setTitle(o.getTitle());
        dto.setDescription(o.getDescription());
        dto.setOpportunityType(o.getOpportunityType());
        dto.setLocation(o.getLocation());
        dto.setWorkMode(o.getWorkMode());
        dto.setExperienceLevel(o.getExperienceLevel());
        dto.setSalaryRange(o.getSalaryRange());
        dto.setDeadline(o.getDeadline());
        dto.setStatus(o.getStatus());
        dto.setCreatedByUserId(o.getCreatedBy().getId());
        dto.setCreatedByUserName(o.getCreatedBy().getFirstName() + " " + o.getCreatedBy().getLastName());
        dto.setCreatedAt(o.getCreatedAt());

        if (userId != null) {
            dto.setIsBookmarked(bookmarkRepository.existsByUserIdAndOpportunityId(userId, o.getId()));
        }

        return dto;
    }
}
