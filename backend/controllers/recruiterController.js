const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
    if (!recruiters || recruiters.length === 0) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }
    const recruiter = recruiters[0];

    // Total jobs posted
    const [jobsCount] = await db.query('SELECT COUNT(*) as total FROM jobs WHERE recruiter_id = ?', [recruiter.id]);
    
    // Total Applicants
    const [appsCount] = await db.query(
      `SELECT COUNT(*) as total 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.recruiter_id = ?`,
      [recruiter.id]
    );

    // Interviews Scheduled
    const [interviewsCount] = await db.query(
      `SELECT COUNT(*) as total 
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       WHERE j.recruiter_id = ? AND i.status = 'scheduled'`,
      [recruiter.id]
    );

    // Active Jobs list
    const [activeJobs] = await db.query(
      'SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY created_at DESC',
      [recruiter.id]
    );

    // Applicants breakdown by status (for analytics)
    const [statusBreakdown] = await db.query(
      `SELECT a.status, COUNT(*) as count 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.recruiter_id = ?
       GROUP BY a.status`,
      [recruiter.id]
    );

    res.json({
      recruiter,
      metrics: {
        totalJobs: jobsCount[0].total,
        totalApplicants: appsCount[0].total,
        interviewsScheduled: interviewsCount[0].total
      },
      jobs: activeJobs.map(j => ({
        ...j,
        skills_required: typeof j.skills_required === 'string' ? JSON.parse(j.skills_required) : j.skills_required
      })),
      statusAnalytics: statusBreakdown
    });

  } catch (err) {
    console.error('Error fetching recruiter dashboard: ', err);
    res.status(500).json({ message: 'Error retrieving recruiter metrics', error: err.message });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, website, industry, logo_url, description } = req.body;

  try {
    const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
    if (!recruiters || recruiters.length === 0) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }
    const recruiter = recruiters[0];

    if (recruiter.company_id) {
      await db.query(
        `UPDATE companies 
         SET name = ?, website = ?, industry = ?, logo_url = ?, description = ? 
         WHERE id = ?`,
        [name, website, industry, logo_url, description, recruiter.company_id]
      );
    } else {
      const [compRes] = await db.query(
        `INSERT INTO companies (name, website, industry, logo_url, description) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, website, industry, logo_url, description]
      );
      await db.query('UPDATE recruiters SET company_id = ? WHERE id = ?', [compRes.insertId, recruiter.id]);
    }

    res.json({ message: 'Company profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update company profile', error: err.message });
  }
};

exports.postJob = async (req, res) => {
  const userId = req.user.id;
  const { title, description, requirements, salary, location, experience_level, skills_required } = req.body;

  try {
    const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
    if (!recruiters || recruiters.length === 0) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }
    const recruiter = recruiters[0];
    
    if (!recruiter.company_id) {
      return res.status(400).json({ message: 'Please set up your Company Profile before posting jobs.' });
    }

    await db.query(
      `INSERT INTO jobs (company_id, recruiter_id, title, description, requirements, salary, location, experience_level, skills_required, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recruiter.company_id,
        recruiter.id,
        title,
        description,
        requirements,
        salary,
        location,
        experience_level,
        JSON.stringify(skills_required || []),
        'approved' // Auto approve for testing
      ]
    );

    res.status(201).json({ message: 'Job vacancy posted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post job vacancy', error: err.message });
  }
};

exports.editJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, requirements, salary, location, experience_level, skills_required } = req.body;

  try {
    await db.query(
      `UPDATE jobs 
       SET title = ?, description = ?, requirements = ?, salary = ?, location = ?, experience_level = ?, skills_required = ? 
       WHERE id = ?`,
      [
        title,
        description,
        requirements,
        salary,
        location,
        experience_level,
        JSON.stringify(skills_required || []),
        id
      ]
    );
    res.json({ message: 'Job vacancy updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job vacancy', error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ message: 'Job vacancy removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};

exports.getApplicants = async (req, res) => {
  const userId = req.user.id;
  try {
    const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
    if (!recruiters || recruiters.length === 0) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    const recruiter = recruiters[0];

    const [apps] = await db.query(
      `SELECT a.id as application_id, a.status as application_status, a.applied_at, a.resume_url,
              s.id as student_id, s.full_name, s.roll_no, s.department, s.cgpa,
              j.id as job_id, j.title as job_title, j.skills_required
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN students s ON a.student_id = s.id
       WHERE j.recruiter_id = ?
       ORDER BY a.applied_at DESC`,
      [recruiter.id]
    );

    // Calculate score match ratios and grab resume analyses
    const detailedApplicants = await Promise.all(apps.map(async (app) => {
      // Find matching resume review if exists
      const [resumes] = await db.query(
        'SELECT ats_score, analysis_data FROM resumes WHERE student_id = ? ORDER BY created_at DESC LIMIT 1',
        [app.student_id]
      );
      
      const atsScore = resumes && resumes.length > 0 ? resumes[0].ats_score : 70; // fallback
      
      // Calculate skill matches ratio
      const [details] = await db.query('SELECT skills FROM student_details WHERE student_id = ?', [app.student_id]);
      let matchPercent = 75; // default fallback
      if (details && details.length > 0) {
        const studentSkills = typeof details[0].skills === 'string' ? JSON.parse(details[0].skills) : (details[0].skills || []);
        const jobSkills = typeof app.skills_required === 'string' ? JSON.parse(app.skills_required) : (app.skills_required || []);
        const matched = jobSkills.filter(js => studentSkills.some(ss => ss.toLowerCase() === js.toLowerCase()));
        matchPercent = jobSkills.length ? Math.round((matched.length / jobSkills.length) * 100) : 100;
      }

      return {
        ...app,
        atsScore,
        skills_required: typeof app.skills_required === 'string' ? JSON.parse(app.skills_required) : app.skills_required,
        matchPercentage: matchPercent
      };
    }));

    res.json(detailedApplicants);

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving applicants list', error: err.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  const { applicationId, scheduleTime, meetingLink, recruiterNotes } = req.body;

  try {
    // Check if application exists
    const [apps] = await db.query('SELECT * FROM applications WHERE id = ?', [applicationId]);
    if (!apps || apps.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const application = apps[0];

    // Create interview record
    await db.query(
      `INSERT INTO interviews (application_id, schedule_time, meeting_link, recruiter_notes, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [applicationId, scheduleTime, meetingLink || '', recruiterNotes || '', 'scheduled']
    );

    // Update application status
    await db.query(
      `UPDATE applications SET status = 'interview_scheduled' WHERE id = ?`,
      [applicationId]
    );

    // Fetch student info to notify
    const [students] = await db.query('SELECT user_id, full_name FROM students WHERE id = ?', [application.student_id]);
    if (students && students.length > 0) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)`,
        [
          students[0].user_id,
          'Interview Scheduled',
          `Congratulations! Your interview has been scheduled for ${new Date(scheduleTime).toLocaleString()}. Link: ${meetingLink || 'N/A'}`
        ]
      );
    }

    res.json({ message: 'Interview scheduled successfully and invitation dispatched' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule interview slot', error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // shortlisted, selected, rejected

  try {
    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    
    // Get student user_id to trigger a notification
    const [apps] = await db.query(
      `SELECT a.student_id, j.title as job_title, c.name as company_name 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    if (apps && apps.length > 0) {
      const app = apps[0];
      const [students] = await db.query('SELECT user_id FROM students WHERE id = ?', [app.student_id]);
      if (students && students.length > 0) {
        let msg = `Your application status for ${app.job_title} at ${app.company_name} has been updated to '${status}'.`;
        if (status === 'selected') {
          msg = `🎉 CONGRATULATIONS! You have been Selected for the role of ${app.job_title} at ${app.company_name}! Check your emails for offer details.`;
        }
        await db.query(
          'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
          [students[0].user_id, 'Application Status Update', msg]
        );
      }
    }

    res.json({ message: `Applicant status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update applicant status', error: err.message });
  }
};
