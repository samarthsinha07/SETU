package com.campus.hub.service;

import com.campus.hub.dto.AuthRequest;
import com.campus.hub.dto.AuthResponse;
import com.campus.hub.dto.RegisterRequest;
import com.campus.hub.entity.AlumniProfile;
import com.campus.hub.entity.Company;
import com.campus.hub.entity.StudentProfile;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.UserRole;
import com.campus.hub.entity.enums.UserStatus;
import com.campus.hub.exception.BadRequestException;
import com.campus.hub.repository.AlumniProfileRepository;
import com.campus.hub.repository.CompanyRepository;
import com.campus.hub.repository.StudentProfileRepository;
import com.campus.hub.repository.UserRepository;
import com.campus.hub.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BadRequestException("Account is suspended. Please contact administrator.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : 
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80");
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);

        // Initialize role-specific profile
        if (savedUser.getRole() == UserRole.STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(savedUser);
            profile.setMajor(request.getMajor() != null ? request.getMajor() : "Computer Science");
            profile.setGraduationYear(request.getGraduationYear() != null ? request.getGraduationYear() : 2026);
            profile.setProfileCompletionPct(30);
            studentProfileRepository.save(profile);
        } else if (savedUser.getRole() == UserRole.ALUMNI) {
            AlumniProfile profile = new AlumniProfile();
            profile.setUser(savedUser);
            profile.setCurrentCompany(request.getCompanyName() != null ? request.getCompanyName() : "Tech Partner");
            profile.setDesignation(request.getDesignation() != null ? request.getDesignation() : "Software Engineer");
            profile.setTotalExperienceYears(2);
            
            if (request.getCompanyName() != null) {
                Company company = companyRepository.findByName(request.getCompanyName()).orElse(null);
                profile.setCompany(company);
            }
            alumniProfileRepository.save(profile);
        }

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole(),
                savedUser.getAvatarUrl()
        );
    }
}
