-- H2 Initial Seed Data

-- ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_STUDENT', 'Student candidate seeking opportunities and referrals'),
(2, 'ROLE_ALUMNI', 'Alumni referrer at partner companies'),
(3, 'ROLE_ADMIN', 'Platform Administrator');

-- USERS (Passwords are BCrypt hashed for "Password123!")
-- Raw BCrypt hash for "Password123!": $2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, avatar_url, phone) VALUES
(1, 'admin@campus.edu', '$2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i', 'System', 'Admin', 'ADMIN', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', '+1-555-0100'),
(2, 'student@campus.edu', '$2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i', 'Aarav', 'Sharma', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80', '+1-555-0101'),
(3, 'alumni@company.com', '$2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i', 'Priya', 'Verma', 'ALUMNI', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', '+1-555-0102'),
(4, 'rohan.student@campus.edu', '$2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i', 'Rohan', 'Gupta', 'STUDENT', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', '+1-555-0103'),
(5, 'vikram.alumni@ey.com', '$2a$10$e8wFp1O.vN1w6GZ8yO3Zue7wV6C6rX7yW8z9A0b1C2d3E4f5G6h7i', 'Vikram', 'Aditya', 'ALUMNI', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', '+1-555-0104');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 3),
(2, 1),
(3, 2),
(4, 1),
(5, 2);

-- COMPANIES
INSERT INTO companies (id, name, domain, industry, website, logo_url, description, is_verified) VALUES
(1, 'EY GDS', 'ey.com', 'Professional Services & Tech Consulting', 'https://ey.com', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80', 'Global Delivery Services providing technology consulting, cybersecurity, and cloud solutions.', TRUE),
(2, 'Google', 'google.com', 'Information Technology & Cloud', 'https://google.com', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80', 'World leader in search engines, cloud computing, AI, and consumer electronics.', TRUE),
(3, 'Microsoft', 'microsoft.com', 'Software & Enterprise Systems', 'https://microsoft.com', 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=150&q=80', 'Empowering every person and organization on the planet to achieve more.', TRUE),
(4, 'Amazon AWS', 'amazon.com', 'Cloud Computing & E-Commerce', 'https://aws.amazon.com', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=150&q=80', 'Global cloud computing provider and digital technology pioneer.', TRUE);

-- STUDENT PROFILES
INSERT INTO student_profiles (user_id, major, graduation_year, gpa, bio, github_url, linkedin_url, portfolio_url, resume_url, profile_completion_pct) VALUES
(2, 'Computer Science & Engineering', 2026, 3.85, 'Final year CS undergrad passionate about Java Spring Boot, microservices architecture, and React frontend development.', 'https://github.com/aaravsharma', 'https://linkedin.com/in/aaravsharma', 'https://aaravsharma.dev', 'https://campus-hub.s3.amazonaws.com/resumes/aarav_resume.pdf', 85),
(4, 'Information Technology', 2025, 3.60, 'Passionate software developer interested in backend systems, database normalization, and REST APIs.', 'https://github.com/rohangupta', 'https://linkedin.com/in/rohangupta', 'https://rohangupta.io', 'https://campus-hub.s3.amazonaws.com/resumes/rohan_resume.pdf', 70);

-- ALUMNI PROFILES
INSERT INTO alumni_profiles (user_id, company_id, current_company, designation, total_experience_years, linkedin_url, bio, referral_slots_available, is_accepting_referrals) VALUES
(3, 1, 'EY GDS', 'Senior Software Engineer', 4, 'https://linkedin.com/in/priya-verma-ey', 'Class of 2022. Building enterprise Java microservices at EY GDS. Happy to mentor and refer driven campus candidates.', 4, TRUE),
(5, 1, 'EY GDS', 'Tech Lead / Staff Architect', 7, 'https://linkedin.com/in/vikram-aditya-ey', 'Alumni Batch 2019. Leading cloud architecture & full stack solutions at EY GDS.', 2, TRUE);

-- SKILLS
INSERT INTO skills (id, name, category) VALUES
(1, 'Java 17', 'Backend'),
(2, 'Spring Boot', 'Backend'),
(3, 'Spring Security', 'Backend'),
(4, 'React 18', 'Frontend'),
(5, 'TypeScript', 'Frontend'),
(6, 'MySQL', 'Database'),
(7, 'Microservices', 'Architecture'),
(8, 'Docker', 'DevOps');

-- USER SKILLS
INSERT INTO user_skills (id, user_id, skill_id, proficiency_level) VALUES
(1, 2, 1, 'ADVANCED'),
(2, 2, 2, 'ADVANCED'),
(3, 2, 4, 'INTERMEDIATE'),
(4, 2, 6, 'ADVANCED'),
(5, 3, 1, 'EXPERT'),
(6, 3, 2, 'EXPERT'),
(7, 3, 7, 'ADVANCED'),
(8, 5, 1, 'EXPERT'),
(9, 5, 8, 'EXPERT');

-- RESUMES
INSERT INTO resumes (id, user_id, title, file_url, is_primary) VALUES
(1, 2, 'Aarav_Sharma_SDE_Resume.pdf', 'https://campus-hub.s3.amazonaws.com/resumes/aarav_resume.pdf', TRUE),
(2, 4, 'Rohan_Gupta_Backend_Resume.pdf', 'https://campus-hub.s3.amazonaws.com/resumes/rohan_resume.pdf', TRUE);

-- OPPORTUNITIES
INSERT INTO opportunities (id, company_id, title, description, opportunity_type, location, work_mode, experience_level, salary_range, deadline, status, created_by_user_id) VALUES
(1, 1, 'Associate Consultant - Full Stack Java Developer', 'We are looking for high-performing graduates skilled in Java 17, Spring Boot, microservices, and React 18 to join our Technology Consulting division at EY GDS.', 'FULL_TIME', 'Bengaluru / Hyderabad', 'HYBRID', 'ENTRY_LEVEL', '₹8,50,000 - ₹12,00,000 LPA', '2026-09-30', 'PUBLISHED', 1),
(2, 1, 'Cybersecurity & Cloud Systems Analyst', 'Opportunity to work on enterprise cloud security, IAM, JWT, Spring Security, and AWS infrastructure.', 'FULL_TIME', 'Gurugram', 'REMOTE', 'ENTRY_LEVEL', '₹9,00,000 - ₹11,50,000 LPA', '2026-10-15', 'PUBLISHED', 1),
(3, 2, 'Software Engineering Intern - Summer 2026', 'Work alongside world-class engineers on scalable distributed systems, search index optimization, and Web frontend apps.', 'INTERNSHIP', 'Bengaluru', 'ON_SITE', 'INTERN', '₹80,000 / month', '2026-08-31', 'PUBLISHED', 1),
(4, 3, 'Graduate Engineer Trainee (GET)', 'Entry-level software development position working on Microsoft Azure enterprise cloud solutions.', 'FULL_TIME', 'Hyderabad', 'HYBRID', 'ENTRY_LEVEL', '₹14,00,000 - ₹18,00,000 LPA', '2026-09-15', 'PENDING_VERIFICATION', 1);

-- APPLICATIONS
INSERT INTO applications (id, student_id, opportunity_id, resume_id, cover_letter, current_status) VALUES
(1, 2, 1, 1, 'Enthusiastic about joining EY GDS tech consulting. Strong expertise in Java 17, Spring Boot, MySQL, and React frontend architecture.', 'OA'),
(2, 2, 3, 1, 'Deep interest in distributed search and web engines.', 'SCREENING');

-- APPLICATION STATUS HISTORY
INSERT INTO application_status_history (id, application_id, status, notes, changed_by_user_id) VALUES
(1, 1, 'APPLIED', 'Application submitted by candidate via platform', 2),
(2, 1, 'SCREENING', 'Resume shortlisted by EY GDS Talent Acquisition', 1),
(3, 1, 'OA', 'Online Assessment link sent to candidate (Deadline: Aug 15)', 1),
(4, 2, 'APPLIED', 'Application submitted by candidate', 2),
(5, 2, 'SCREENING', 'Under initial profile evaluation', 1);

-- REFERRAL REQUESTS
INSERT INTO referral_requests (id, student_id, alumni_id, opportunity_id, message, status, feedback_notes) VALUES
(1, 2, 3, 1, 'Hi Priya! I am a final-year CS student interested in the Associate Consultant Full Stack Java role at EY GDS. I have built enterprise Spring Boot and React projects. Would appreciate your referral!', 'ACCEPTED', 'Great profile! I reviewed your resume and project details. Happy to submit your internal referral.'),
(2, 4, 3, 1, 'Hello Priya, requesting referral for EY GDS Java Developer role. Please check my profile.', 'REQUESTED', NULL);

-- BOOKMARKS
INSERT INTO bookmarks (id, user_id, opportunity_id) VALUES
(1, 2, 1),
(2, 2, 3);

-- NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, is_read, target_url) VALUES
(1, 2, 'Online Assessment Assigned!', 'EY GDS has invited you to complete the Online Assessment for Associate Consultant - Full Stack Java Developer.', 'APPLICATION_UPDATE', FALSE, '/student/applications'),
(2, 2, 'Referral Request Accepted!', 'Priya Verma accepted your referral request for EY GDS. Internal referral submitted!', 'REFERRAL_UPDATE', FALSE, '/student/referrals'),
(3, 3, 'New Referral Request Received', 'Rohan Gupta sent you a referral request for EY GDS Associate Consultant position.', 'REFERRAL_UPDATE', FALSE, '/alumni/referrals');

-- AUDIT LOGS
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address) VALUES
(1, 1, 'VERIFY_COMPANY', 'COMPANY', 1, 'Verified EY GDS company profile', '127.0.0.1'),
(2, 1, 'PUBLISH_OPPORTUNITY', 'OPPORTUNITY', 1, 'Approved and published job listing #1 (EY GDS Java Developer)', '127.0.0.1'),
(3, 2, 'SUBMIT_APPLICATION', 'APPLICATION', 1, 'Applied for opportunity #1', '127.0.0.1');
