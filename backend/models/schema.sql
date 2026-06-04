-- AI-Powered Placement Management Platform Database Schema

CREATE DATABASE IF NOT EXISTS placement_platform;
USE placement_platform;

-- 1. Users Table (Core authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'recruiter', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    logo_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table (Link to users)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    cgpa DECIMAL(4, 2) NOT NULL,
    resume_url VARCHAR(500),
    profile_completed INT DEFAULT 0, -- percentage
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Student Details (Bio, skills, projects, achievements, education)
CREATE TABLE IF NOT EXISTS student_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    education JSON,       -- School, Degree, Graduation Year, CGPA
    skills JSON,          -- Array of strings
    certifications JSON,  -- Name, Issuer, Date
    projects JSON,        -- Title, Description, Tech Stack, Link
    achievements JSON,    -- List of achievements
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 5. Recruiters Table (Link to users and companies)
CREATE TABLE IF NOT EXISTS recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- 6. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    recruiter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    experience_level VARCHAR(100),
    skills_required JSON, -- Array of skills required
    status ENUM('pending', 'approved', 'removed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- 7. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    student_id INT NOT NULL,
    resume_url VARCHAR(500),
    status ENUM('applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    schedule_time DATETIME NOT NULL,
    meeting_link VARCHAR(500),
    recruiter_notes TEXT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- 9. Resumes Table (AI Analysis outcomes)
CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    ats_score INT NOT NULL,
    quality_score INT NOT NULL,
    analysis_data JSON, -- Stores missing keywords, suggestions, skill gap, strengths, weaknesses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('student', 'recruiter', 'placement') NOT NULL,
    generated_by INT NOT NULL,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
);


-- ==================== SAMPLE DATA SEEDING ====================

-- 1. Insert Core Users (Password is 'password123' bcrypt hash: $2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2)
INSERT INTO users (id, email, password_hash, role) VALUES
(1, 'admin@placement.com', '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', 'admin'),
(2, 'student@placement.com', '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', 'student'),
(3, 'recruiter@google.com', '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', 'recruiter'),
(4, 'recruiter@microsoft.com', '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', 'recruiter');

-- 2. Insert Companies
INSERT INTO companies (id, name, website, industry, logo_url, description) VALUES
(1, 'Google', 'https://google.com', 'Technology', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', 'Organize the worlds information and make it universally accessible and useful.'),
(2, 'Microsoft', 'https://microsoft.com', 'Technology', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 'Empower every person and every organization on the planet to achieve more.');

-- 3. Insert Recruiters
INSERT INTO recruiters (id, user_id, company_id, full_name, phone, is_approved) VALUES
(1, 3, 1, 'Sarah Jenkins', '+15550199', TRUE),
(2, 4, 2, 'David Chen', '+15550244', TRUE);

-- 4. Insert Students
INSERT INTO students (id, user_id, full_name, roll_no, department, phone, cgpa, resume_url, profile_completed) VALUES
(1, 2, 'Alex Carter', 'CS2023089', 'Computer Science & Engineering', '+15559812', 9.15, '/uploads/resumes/alex_carter_resume.pdf', 85);

-- 5. Insert Student Details
INSERT INTO student_details (id, student_id, education, skills, certifications, projects, achievements) VALUES
(1, 1, 
'{"high_school": "Oakridge Academy", "ug_college": "Tech Institute of Engineering", "ug_degree": "B.Tech CSE", "ug_year": 2026, "ug_cgpa": 9.15}',
'["JavaScript", "React", "Node.js", "Express.js", "MySQL", "Tailwind CSS", "Git", "Python"]',
'[{"name": "AWS Certified Solutions Architect", "issuer": "Amazon Web Services", "date": "2025-05"}, {"name": "React Developer Certificate", "issuer": "Meta", "date": "2024-09"}]',
'[{"title": "E-Commerce Cloud Engine", "desc": "Microservices backend managing 10k product catalogs.", "stack": "Node.js, Express, Redis, Docker", "link": "github.com/alex/ecommerce"}, {"title": "AI Image Classifier", "desc": "Tensorflow CNN classifier achieving 96% accuracy on dataset.", "stack": "Python, TensorFlow, Flask", "link": "github.com/alex/classifier"}]',
'["1st Place at National Hackathon 2025", "Dean List academic distinction for 3 consecutive semesters"]'
);

-- 6. Insert Jobs
INSERT INTO jobs (id, company_id, recruiter_id, title, description, requirements, salary, location, experience_level, skills_required, status) VALUES
(1, 1, 1, 'Software Engineer I (Frontend)', 'We are looking for a Frontend Engineer to join our Core Search UI team. You will build highly responsive web pages using React and Next.js, and work with UX designers to craft beautiful user interfaces.', 'Bachelor degree in CS or equivalent, Strong React/JS skills, Familiarity with performance optimizations and Tailwind CSS.', '$120,000 - $140,000', 'Mountain View, CA (Hybrid)', '0-2 Years', '["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"]', 'approved'),
(2, 2, 2, 'Cloud Software Engineer (Backend)', 'Build scalable cloud APIs and orchestration microservices on Azure. Optimize latency, database calls, and design robust schema migrations.', 'Proficient in Node.js, Express, Go or C#, experience with SQL/NoSQL databases, and cloud platforms like Azure/AWS.', '$135,000 - $160,000', 'Redmond, WA', '1-3 Years', '["Node.js", "Express.js", "MySQL", "Azure", "Docker"]', 'approved'),
(3, 1, 1, 'Machine Learning Associate', 'Develop and fine-tune language modeling structures and design conversational assistant integrations.', 'Strong background in Python, PyTorch/TensorFlow, and vector databases.', '$150,000 - $170,000', 'San Francisco, CA', '2-4 Years', '["Python", "TensorFlow", "PyTorch", "MySQL"]', 'approved');

-- 7. Insert Applications
INSERT INTO applications (id, job_id, student_id, resume_url, status, applied_at) VALUES
(1, 1, 1, '/uploads/resumes/alex_carter_resume.pdf', 'interview_scheduled', '2026-06-01 10:00:00'),
(2, 2, 1, '/uploads/resumes/alex_carter_resume.pdf', 'applied', '2026-06-02 14:30:00');

-- 8. Insert Interviews
INSERT INTO interviews (id, application_id, schedule_time, meeting_link, recruiter_notes, status) VALUES
(1, 1, '2026-06-10 10:00:00', 'https://meet.google.com/abc-defg-hij', 'Initial technical assessment panel covering React hooks, state management, and basic CSS grid/flexbox.', 'scheduled');

-- 9. Insert Resumes Analysis
INSERT INTO resumes (id, student_id, file_name, file_path, ats_score, quality_score, analysis_data) VALUES
(1, 1, 'alex_carter_resume.pdf', '/uploads/resumes/alex_carter_resume.pdf', 82, 88, 
'{"missing_keywords": ["TypeScript", "GraphQL", "Next.js"], "suggestions": ["Include impact metrics for projects (e.g. Optimized queries by 40%)", "Add TypeScript to your Skills segment to match modern frontend requirements"], "strengths": ["Excellent academic records (CGPA 9.15)", "Hands-on projects with modern stacks (Docker, React)"], "weaknesses": ["Lack of testing framework experience (Jest, Cypress)", "Low word density on business impact indicators"]}'
);

-- 10. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, is_read) VALUES
(1, 2, 'Interview Scheduled', 'Your interview for Frontend Engineer at Google has been scheduled for June 10th, 2026.', FALSE),
(2, 2, 'Welcome to Placement Hub', 'Complete your student profile to start receiving AI job recommendations.', TRUE);
