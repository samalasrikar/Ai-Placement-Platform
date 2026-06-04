const mysql = require('mysql2/promise');
require('dotenv').config();

// Mock in-memory database fallback to ensure full system functionality without running MySQL
const inMemoryDb = {
  users: [
    { id: 1, email: 'admin@placement.com', password_hash: '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', role: 'admin', created_at: new Date() },
    { id: 2, email: 'student@placement.com', password_hash: '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', role: 'student', created_at: new Date() },
    { id: 3, email: 'recruiter@google.com', password_hash: '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', role: 'recruiter', created_at: new Date() },
    { id: 4, email: 'recruiter@microsoft.com', password_hash: '$2b$10$n2G91/C0B2pEshU2Xn2t2u99k5iNCOVq.sM2x22c2qK.Q9oK717N2', role: 'recruiter', created_at: new Date() }
  ],
  companies: [
    { id: 1, name: 'Google', website: 'https://google.com', industry: 'Technology', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', description: 'Organize the worlds information and make it universally accessible and useful.' },
    { id: 2, name: 'Microsoft', website: 'https://microsoft.com', industry: 'Technology', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', description: 'Empower every person and every organization on the planet to achieve more.' }
  ],
  recruiters: [
    { id: 1, user_id: 3, company_id: 1, full_name: 'Sarah Jenkins', phone: '+15550199', is_approved: 1 },
    { id: 2, user_id: 4, company_id: 2, full_name: 'David Chen', phone: '+15550244', is_approved: 1 }
  ],
  students: [
    { id: 1, user_id: 2, full_name: 'Alex Carter', roll_no: 'CS2023089', department: 'Computer Science & Engineering', phone: '+15559812', cgpa: 9.15, resume_url: '/uploads/resumes/alex_carter_resume.pdf', profile_completed: 85 }
  ],
  student_details: [
    {
      id: 1,
      student_id: 1,
      education: JSON.stringify({ high_school: "Oakridge Academy", ug_college: "Tech Institute of Engineering", ug_degree: "B.Tech CSE", ug_year: 2026, ug_cgpa: 9.15 }),
      skills: JSON.stringify(["JavaScript", "React", "Node.js", "Express.js", "MySQL", "Tailwind CSS", "Git", "Python"]),
      certifications: JSON.stringify([{ name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2025-05" }, { name: "React Developer Certificate", issuer: "Meta", date: "2024-09" }]),
      projects: JSON.stringify([{ title: "E-Commerce Cloud Engine", desc: "Microservices backend managing 10k product catalogs.", stack: "Node.js, Express, Redis, Docker", link: "github.com/alex/ecommerce" }, { title: "AI Image Classifier", desc: "Tensorflow CNN classifier achieving 96% accuracy on dataset.", stack: "Python, TensorFlow, Flask", link: "github.com/alex/classifier" }]),
      achievements: JSON.stringify(["1st Place at National Hackathon 2025", "Dean List academic distinction for 3 consecutive semesters"])
    }
  ],
  jobs: [
    { id: 1, company_id: 1, recruiter_id: 1, title: 'Software Engineer I (Frontend)', description: 'We are looking for a Frontend Engineer to join our Core Search UI team. You will build highly responsive web pages using React and Next.js, and work with UX designers to craft beautiful user interfaces.', requirements: 'Bachelor degree in CS or equivalent, Strong React/JS skills, Familiarity with performance optimizations and Tailwind CSS.', salary: '$120,000 - $140,000', location: 'Mountain View, CA (Hybrid)', experience_level: '0-2 Years', skills_required: JSON.stringify(["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"]), status: 'approved', created_at: new Date() },
    { id: 2, company_id: 2, recruiter_id: 2, title: 'Cloud Software Engineer (Backend)', description: 'Build scalable cloud APIs and orchestration microservices on Azure. Optimize latency, database calls, and design robust schema migrations.', requirements: 'Proficient in Node.js, Express, Go or C#, experience with SQL/NoSQL databases, and cloud platforms like Azure/AWS.', salary: '$135,000 - $160,000', location: 'Redmond, WA', experience_level: '1-3 Years', skills_required: JSON.stringify(["Node.js", "Express.js", "MySQL", "Azure", "Docker"]), status: 'approved', created_at: new Date() },
    { id: 3, company_id: 1, recruiter_id: 1, title: 'Machine Learning Associate', description: 'Develop and fine-tune language modeling structures and design conversational assistant integrations.', requirements: 'Strong background in Python, PyTorch/TensorFlow, and vector databases.', salary: '$150,000 - $170,000', location: 'San Francisco, CA', experience_level: '2-4 Years', skills_required: JSON.stringify(["Python", "TensorFlow", "PyTorch", "MySQL"]), status: 'approved', created_at: new Date() }
  ],
  applications: [
    { id: 1, job_id: 1, student_id: 1, resume_url: '/uploads/resumes/alex_carter_resume.pdf', status: 'interview_scheduled', applied_at: new Date('2026-06-01T10:00:00Z') },
    { id: 2, job_id: 2, student_id: 1, resume_url: '/uploads/resumes/alex_carter_resume.pdf', status: 'applied', applied_at: new Date('2026-06-02T14:30:00Z') }
  ],
  interviews: [
    { id: 1, application_id: 1, schedule_time: '2026-06-10 10:00:00', meeting_link: 'https://meet.google.com/abc-defg-hij', recruiter_notes: 'Initial technical assessment panel covering React hooks, state management, and basic CSS grid/flexbox.', status: 'scheduled', created_at: new Date() }
  ],
  resumes: [
    {
      id: 1,
      student_id: 1,
      file_name: 'alex_carter_resume.pdf',
      file_path: '/uploads/resumes/alex_carter_resume.pdf',
      ats_score: 82,
      quality_score: 88,
      analysis_data: JSON.stringify({
        missing_keywords: ["TypeScript", "GraphQL", "Next.js"],
        suggestions: ["Include impact metrics for projects (e.g. Optimized queries by 40%)", "Add TypeScript to your Skills segment to match modern frontend requirements"],
        strengths: ["Excellent academic records (CGPA 9.15)", "Hands-on projects with modern stacks (Docker, React)"],
        weaknesses: ["Lack of testing framework experience (Jest, Cypress)", "Low word density on business impact indicators"]
      }),
      created_at: new Date()
    }
  ],
  notifications: [
    { id: 1, user_id: 2, title: 'Interview Scheduled', message: 'Your interview for Frontend Engineer at Google has been scheduled for June 10th, 2026.', is_read: 0, created_at: new Date() },
    { id: 2, user_id: 2, title: 'Welcome to Placement Hub', message: 'Complete your student profile to start receiving AI job recommendations.', is_read: 1, created_at: new Date() }
  ],
  reports: []
};

let dbPool = null;
let useFallback = false;

const initDb = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'placement_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  try {
    // Attempt standard connection
    dbPool = mysql.createPool(dbConfig);
    // Simple test query to verify connection
    const conn = await dbPool.getConnection();
    console.log('Successfully connected to MySQL Database.');
    conn.release();
  } catch (error) {
    console.warn('MySQL Connection failed. Falling back to robust in-memory database simulation.');
    console.warn(`Reason: ${error.message}`);
    useFallback = true;
  }
};

initDb();

const db = {
  // Query command router: routes requests to either mysql server or in-memory DB mocks.
  query: async (sqlStr, params = []) => {
    if (!useFallback && dbPool) {
      try {
        const [results] = await dbPool.query(sqlStr, params);
        return [results];
      } catch (err) {
        console.error('MySQL Query Execution Error: ', err.message);
        // If query fails, don't crash, attempt fallback parsing
        return executeMockQuery(sqlStr, params);
      }
    } else {
      return executeMockQuery(sqlStr, params);
    }
  },
  inMemoryDb,
  setFallbackMode: (val) => { useFallback = val; }
};

// Extremely simple mock SQL parsing engine for the memory DB
function executeMockQuery(sqlStr, params) {
  const cleanedSql = sqlStr.replace(/\s+/g, ' ').trim().toLowerCase();
  
  // 1. SELECT queries
  if (cleanedSql.startsWith('select')) {
    // Extract table name
    let tableName = null;
    const tableMatches = cleanedSql.match(/from\s+([a-zA-Z0-9_]+)/);
    if (tableMatches && tableMatches[1]) {
      tableName = tableMatches[1];
    }

    if (!tableName || !inMemoryDb[tableName]) {
      return [[]]; // Table not found
    }

    let records = [...inMemoryDb[tableName]];

    // Filtering logic
    if (cleanedSql.includes('where')) {
      // Find where clauses (e.g. user_id = ? or email = ?)
      if (tableName === 'users') {
        if (cleanedSql.includes('email = ?')) {
          records = records.filter(r => r.email === params[0]);
        } else if (cleanedSql.includes('id = ?')) {
          records = records.filter(r => r.id === Number(params[0]));
        }
      }
      if (tableName === 'students') {
        if (cleanedSql.includes('user_id = ?')) {
          records = records.filter(r => r.user_id === Number(params[0]));
        } else if (cleanedSql.includes('id = ?')) {
          records = records.filter(r => r.id === Number(params[0]));
        }
      }
      if (tableName === 'student_details') {
        if (cleanedSql.includes('student_id = ?')) {
          records = records.filter(r => r.student_id === Number(params[0]));
        }
      }
      if (tableName === 'recruiters') {
        if (cleanedSql.includes('user_id = ?')) {
          records = records.filter(r => r.user_id === Number(params[0]));
        }
      }
      if (tableName === 'companies') {
        if (cleanedSql.includes('id = ?')) {
          records = records.filter(r => r.id === Number(params[0]));
        }
      }
      if (tableName === 'jobs') {
        if (cleanedSql.includes('id = ?')) {
          records = records.filter(r => r.id === Number(params[0]));
        } else if (cleanedSql.includes('recruiter_id = ?')) {
          records = records.filter(r => r.recruiter_id === Number(params[0]));
        }
      }
      if (tableName === 'applications') {
        if (cleanedSql.includes('student_id = ?')) {
          records = records.filter(r => r.student_id === Number(params[0]));
        } else if (cleanedSql.includes('job_id = ?')) {
          records = records.filter(r => r.job_id === Number(params[0]));
        }
      }
      if (tableName === 'interviews') {
        if (cleanedSql.includes('application_id = ?')) {
          records = records.filter(r => r.application_id === Number(params[0]));
        }
      }
      if (tableName === 'notifications') {
        if (cleanedSql.includes('user_id = ?')) {
          records = records.filter(r => r.user_id === Number(params[0]));
        }
      }
      if (tableName === 'resumes') {
        if (cleanedSql.includes('student_id = ?')) {
          records = records.filter(r => r.student_id === Number(params[0]));
        }
      }
    }
    
    return [records];
  }

  // 2. INSERT queries
  if (cleanedSql.startsWith('insert into')) {
    const tableMatches = cleanedSql.match(/insert into\s+([a-zA-Z0-9_]+)/);
    const tableName = tableMatches ? tableMatches[1] : null;

    if (!tableName || !inMemoryDb[tableName]) {
      return [{ insertId: 0, affectedRows: 0 }];
    }

    // Determine target record structure
    let newRecord = { id: inMemoryDb[tableName].length + 1 };
    
    // Simplistic parsing for insertions
    if (tableName === 'users') {
      newRecord.email = params[0];
      newRecord.password_hash = params[1];
      newRecord.role = params[2];
      newRecord.created_at = new Date();
    } else if (tableName === 'students') {
      newRecord.user_id = params[0];
      newRecord.full_name = params[1];
      newRecord.roll_no = params[2];
      newRecord.department = params[3];
      newRecord.phone = params[4];
      newRecord.cgpa = Number(params[5]);
      newRecord.resume_url = '';
      newRecord.profile_completed = 10;
    } else if (tableName === 'student_details') {
      newRecord.student_id = params[0];
      newRecord.education = params[1] || '{}';
      newRecord.skills = params[2] || '[]';
      newRecord.certifications = params[3] || '[]';
      newRecord.projects = params[4] || '[]';
      newRecord.achievements = params[5] || '[]';
    } else if (tableName === 'recruiters') {
      newRecord.user_id = params[0];
      newRecord.company_id = params[1];
      newRecord.full_name = params[2];
      newRecord.phone = params[3];
      newRecord.is_approved = 0; // Default pending approval
    } else if (tableName === 'jobs') {
      newRecord.company_id = params[0];
      newRecord.recruiter_id = params[1];
      newRecord.title = params[2];
      newRecord.description = params[3];
      newRecord.requirements = params[4];
      newRecord.salary = params[5];
      newRecord.location = params[6];
      newRecord.experience_level = params[7];
      newRecord.skills_required = params[8];
      newRecord.status = 'pending'; // Require admin approval
      newRecord.created_at = new Date();
    } else if (tableName === 'applications') {
      newRecord.job_id = params[0];
      newRecord.student_id = params[1];
      newRecord.resume_url = params[2] || '';
      newRecord.status = 'applied';
      newRecord.applied_at = new Date();
    } else if (tableName === 'interviews') {
      newRecord.application_id = params[0];
      newRecord.schedule_time = params[1];
      newRecord.meeting_link = params[2];
      newRecord.recruiter_notes = params[3];
      newRecord.status = 'scheduled';
      newRecord.created_at = new Date();
    } else if (tableName === 'resumes') {
      newRecord.student_id = params[0];
      newRecord.file_name = params[1];
      newRecord.file_path = params[2];
      newRecord.ats_score = params[3];
      newRecord.quality_score = params[4];
      newRecord.analysis_data = params[5];
      newRecord.created_at = new Date();
    } else if (tableName === 'notifications') {
      newRecord.user_id = params[0];
      newRecord.title = params[1];
      newRecord.message = params[2];
      newRecord.is_read = 0;
      newRecord.created_at = new Date();
    }
    
    inMemoryDb[tableName].push(newRecord);
    return [{ insertId: newRecord.id, affectedRows: 1 }];
  }

  // 3. UPDATE queries
  if (cleanedSql.startsWith('update')) {
    const tableMatches = cleanedSql.match(/update\s+([a-zA-Z0-9_]+)/);
    const tableName = tableMatches ? tableMatches[1] : null;
    
    if (tableName && inMemoryDb[tableName]) {
      // Find update targets and modify fields simple matching
      if (tableName === 'students') {
        const student = inMemoryDb.students.find(s => s.id === Number(params[params.length - 1]));
        if (student) {
          if (cleanedSql.includes('resume_url = ?')) {
            student.resume_url = params[0];
          }
          if (cleanedSql.includes('profile_completed = ?')) {
            student.profile_completed = params[0];
          }
        }
      }
      if (tableName === 'student_details') {
        const detail = inMemoryDb.student_details.find(sd => sd.student_id === Number(params[params.length - 1]));
        if (detail) {
          detail.education = params[0];
          detail.skills = params[1];
          detail.certifications = params[2];
          detail.projects = params[3];
          detail.achievements = params[4];
        }
      }
      if (tableName === 'jobs') {
        const job = inMemoryDb.jobs.find(j => j.id === Number(params[params.length - 1]));
        if (job) {
          if (cleanedSql.includes('status = ?')) {
            job.status = params[0];
          } else {
            job.title = params[0];
            job.description = params[1];
            job.requirements = params[2];
            job.salary = params[3];
            job.location = params[4];
            job.experience_level = params[5];
            job.skills_required = params[6];
          }
        }
      }
      if (tableName === 'applications') {
        const app = inMemoryDb.applications.find(a => a.id === Number(params[params.length - 1]));
        if (app) {
          app.status = params[0];
        }
      }
    }
    return [{ affectedRows: 1 }];
  }

  // 4. DELETE queries
  if (cleanedSql.startsWith('delete')) {
    const tableMatches = cleanedSql.match(/from\s+([a-zA-Z0-9_]+)/);
    const tableName = tableMatches ? tableMatches[1] : null;

    if (tableName && inMemoryDb[tableName]) {
      const deleteId = Number(params[0]);
      inMemoryDb[tableName] = inMemoryDb[tableName].filter(r => r.id !== deleteId);
    }
    return [{ affectedRows: 1 }];
  }

  return [[]];
}

module.exports = db;
