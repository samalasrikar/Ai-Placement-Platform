const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get Student Profile
    const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    const student = students[0];

    // Profile Completion Details
    const [details] = await db.query('SELECT * FROM student_details WHERE student_id = ?', [student.id]);
    
    // Recent Applications
    const [apps] = await db.query(
      `SELECT a.*, j.title as job_title, c.name as company_name, c.logo_url 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.student_id = ? 
       ORDER BY a.applied_at DESC LIMIT 5`,
      [student.id]
    );

    // Upcoming Interviews
    const [interviews] = await db.query(
      `SELECT i.*, j.title as job_title, c.name as company_name, c.logo_url
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.student_id = ? AND i.status = 'scheduled' 
       ORDER BY i.schedule_time ASC`,
      [student.id]
    );

    // Recommended Jobs (Matched against student skills)
    let recommended = [];
    if (details && details.length > 0) {
      const skillsArr = typeof details[0].skills === 'string' ? JSON.parse(details[0].skills) : (details[0].skills || []);
      const [allJobs] = await db.query(
        `SELECT j.*, c.name as company_name, c.logo_url, c.industry 
         FROM jobs j
         JOIN companies c ON j.company_id = c.id
         WHERE j.status = 'approved'`
      );

      // Perform a soft match metric based on skills
      recommended = allJobs.map(job => {
        const reqSkills = typeof job.skills_required === 'string' ? JSON.parse(job.skills_required) : (job.skills_required || []);
        const matched = reqSkills.filter(s => skillsArr.some(sk => sk.toLowerCase() === s.toLowerCase()));
        const matchPercent = reqSkills.length ? Math.round((matched.length / reqSkills.length) * 100) : 0;
        return { ...job, matchPercentage: matchPercent };
      })
      .filter(job => job.matchPercentage > 20)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
    }

    // Notifications
    const [notifs] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    res.json({
      student,
      profileCompletion: student.profile_completed,
      recentApplications: apps,
      upcomingInterviews: interviews,
      recommendedJobs: recommended,
      notifications: notifs
    });

  } catch (err) {
    console.error('Error fetching student dashboard: ', err);
    res.status(500).json({ message: 'Error retrieving student dashboard data', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { full_name, phone, cgpa, department, education, skills, certifications, projects, achievements } = req.body;

  try {
    const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    const student = students[0];

    // Compute profile completeness percentage based on values filled
    let completeness = 20; // Default base value
    if (phone) completeness += 10;
    if (cgpa) completeness += 10;
    if (skills && skills.length) completeness += 20;
    if (certifications && certifications.length) completeness += 10;
    if (projects && projects.length) completeness += 20;
    if (education && Object.keys(education).length) completeness += 10;
    if (completeness > 100) completeness = 100;

    // Update Students core table
    await db.query(
      'UPDATE students SET full_name = ?, phone = ?, cgpa = ?, department = ?, profile_completed = ? WHERE id = ?',
      [full_name || student.full_name, phone || student.phone, cgpa || student.cgpa, department || student.department, completeness, student.id]
    );

    // Update Student Details
    const [detailsExist] = await db.query('SELECT * FROM student_details WHERE student_id = ?', [student.id]);
    if (detailsExist && detailsExist.length > 0) {
      await db.query(
        'UPDATE student_details SET education = ?, skills = ?, certifications = ?, projects = ?, achievements = ? WHERE student_id = ?',
        [
          JSON.stringify(education || {}),
          JSON.stringify(skills || []),
          JSON.stringify(certifications || []),
          JSON.stringify(projects || []),
          JSON.stringify(achievements || []),
          student.id
        ]
      );
    } else {
      await db.query(
        'INSERT INTO student_details (student_id, education, skills, certifications, projects, achievements) VALUES (?, ?, ?, ?, ?, ?)',
        [
          student.id,
          JSON.stringify(education || {}),
          JSON.stringify(skills || []),
          JSON.stringify(certifications || []),
          JSON.stringify(projects || []),
          JSON.stringify(achievements || [])
        ]
      );
    }

    res.json({ message: 'Profile updated successfully', completeness });
  } catch (err) {
    console.error('Error updating profile: ', err);
    res.status(500).json({ message: 'Failed to update student profile data', error: err.message });
  }
};

exports.getJobsListings = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT j.*, c.name as company_name, c.logo_url, c.industry 
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.status = 'approved'
       ORDER BY j.created_at DESC`
    );
    
    // Parse json skills_required
    const parsedJobs = jobs.map(j => ({
      ...j,
      skills_required: typeof j.skills_required === 'string' ? JSON.parse(j.skills_required) : j.skills_required
    }));
    
    res.json(parsedJobs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving job listings', error: err.message });
  }
};

exports.getJobDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [jobs] = await db.query(
      `SELECT j.*, c.name as company_name, c.logo_url, c.website as company_website, c.description as company_description, c.industry
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = ?`,
      [id]
    );

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = jobs[0];
    job.skills_required = typeof job.skills_required === 'string' ? JSON.parse(job.skills_required) : job.skills_required;

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving job details', error: err.message });
  }
};

exports.applyJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;

  try {
    const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Student profile required to apply for jobs' });
    }
    const student = students[0];

    // Check if already applied
    const [existing] = await db.query(
      'SELECT * FROM applications WHERE job_id = ? AND student_id = ?',
      [jobId, student.id]
    );
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'You have already applied for this job listing' });
    }

    const resumeUrl = student.resume_url || '/uploads/resumes/default.pdf';

    await db.query(
      'INSERT INTO applications (job_id, student_id, resume_url, status) VALUES (?, ?, ?, ?)',
      [jobId, student.id, resumeUrl, 'applied']
    );

    // Fetch recruiter info to send notification
    const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobs && jobs.length > 0) {
      const job = jobs[0];
      const [recruiters] = await db.query('SELECT * FROM recruiters WHERE id = ?', [job.recruiter_id]);
      if (recruiters && recruiters.length > 0) {
        // Notify recruiter
        await db.query(
          'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
          [recruiters[0].user_id, 'New Application Received', `Student ${student.full_name} has applied for ${job.title}.`]
        );
      }
    }

    res.json({ message: 'Application submitted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Job application submission failed', error: err.message });
  }
};

exports.getAppliedJobs = async (req, res) => {
  const userId = req.user.id;
  try {
    const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    if (!students || students.length === 0) {
      return res.json([]);
    }
    const student = students[0];

    const [apps] = await db.query(
      `SELECT a.*, j.title as job_title, j.salary, j.location, c.name as company_name, c.logo_url
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.student_id = ?
       ORDER BY a.applied_at DESC`,
      [student.id]
    );

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve applications', error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const [notifs] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get notifications', error: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err.message });
  }
};
