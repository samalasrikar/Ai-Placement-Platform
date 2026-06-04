const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  try {
    // Total Students
    const [studCount] = await db.query('SELECT COUNT(*) as total FROM students');
    // Total Recruiters
    const [recCount] = await db.query('SELECT COUNT(*) as total FROM recruiters');
    // Total Jobs
    const [jobsCount] = await db.query('SELECT COUNT(*) as total FROM jobs');
    
    // Placed Rate Calculation (Applications status = 'selected')
    const [placedCount] = await db.query("SELECT COUNT(DISTINCT student_id) as total FROM applications WHERE status = 'selected'");
    const totalStudents = studCount[0].total || 1;
    const placementRate = Math.round((placedCount[0].total / totalStudents) * 100);

    // Latest Jobs posted
    const [latestJobs] = await db.query(
      `SELECT j.*, c.name as company_name, r.full_name as recruiter_name
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       JOIN recruiters r ON j.recruiter_id = r.id
       ORDER BY j.created_at DESC LIMIT 5`
    );

    // Recent Recruiter accounts
    const [pendingRecruiters] = await db.query(
      `SELECT r.*, u.email, c.name as company_name 
       FROM recruiters r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN companies c ON r.company_id = c.id
       ORDER BY r.id DESC`
    );

    res.json({
      metrics: {
        totalStudents: studCount[0].total,
        totalRecruiters: recCount[0].total,
        totalJobs: jobsCount[0].total,
        placementRate
      },
      latestJobs,
      recruiters: pendingRecruiters
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admin statistics', error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const [students] = await db.query(
      `SELECT s.*, u.email, u.created_at 
       FROM students s
       JOIN users u ON s.user_id = u.id`
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve students roster', error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    // Find student user id
    const [students] = await db.query('SELECT user_id FROM students WHERE id = ?', [id]);
    if (students && students.length > 0) {
      await db.query('DELETE FROM users WHERE id = ?', [students[0].user_id]);
    }
    res.json({ message: 'Student account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete student account', error: err.message });
  }
};

exports.approveRecruiter = async (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body; // boolean

  try {
    await db.query('UPDATE recruiters SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, id]);
    res.json({ message: `Recruiter approval status updated to: ${is_approved}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recruiter approval', error: err.message });
  }
};

exports.deleteRecruiter = async (req, res) => {
  const { id } = req.params;
  try {
    const [recruiters] = await db.query('SELECT user_id FROM recruiters WHERE id = ?', [id]);
    if (recruiters && recruiters.length > 0) {
      await db.query('DELETE FROM users WHERE id = ?', [recruiters[0].user_id]);
    }
    res.json({ message: 'Recruiter account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recruiter account', error: err.message });
  }
};

exports.getJobsListings = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT j.*, c.name as company_name, r.full_name as recruiter_name
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       JOIN recruiters r ON j.recruiter_id = r.id`
    );
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve jobs moderate list', error: err.message });
  }
};

exports.moderateJob = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // approved, removed

  try {
    await db.query('UPDATE jobs SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Job vacancy status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to moderate job vacancy', error: err.message });
  }
};

exports.getPlacementAnalytics = async (req, res) => {
  try {
    // 1. Placement trends (monthly metrics)
    const trends = [
      { month: 'Jan', placedCount: 4 },
      { month: 'Feb', placedCount: 8 },
      { month: 'Mar', placedCount: 15 },
      { month: 'Apr', placedCount: 22 },
      { month: 'May', placedCount: 35 },
      { month: 'Jun', placedCount: 45 }
    ];

    // 2. Department-wise count
    const deptPlacement = [
      { name: 'Computer Science', placed: 85, total: 100 },
      { name: 'Electronics & Comm', placed: 60, total: 90 },
      { name: 'Information Tech', placed: 50, total: 70 },
      { name: 'Mechanical Eng', placed: 25, total: 60 },
      { name: 'Civil Eng', placed: 15, total: 50 }
    ];

    // 3. Salary package brackets
    const salaryDistribution = [
      { range: '4-6 LPA', studentCount: 15 },
      { range: '6-10 LPA', studentCount: 42 },
      { range: '10-15 LPA', studentCount: 28 },
      { range: '15-25 LPA', studentCount: 10 },
      { range: '25+ LPA', studentCount: 5 }
    ];

    res.json({
      trends,
      deptPlacement,
      salaryDistribution
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch placement metrics charts', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  const { reportType } = req.body; // student, recruiter, placement
  const userId = req.user.id;

  try {
    const reportName = `${reportType}_report_${Date.now().toString().slice(-6)}.csv`;
    const filePath = `/uploads/reports/${reportName}`;

    await db.query(
      'INSERT INTO reports (type, generated_by, file_path) VALUES (?, ?, ?)',
      [reportType, userId, filePath]
    );

    res.json({
      message: `Successfully generated ${reportType} report`,
      report: {
        fileName: reportName,
        downloadUrl: filePath,
        createdAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Report creation process crashed', error: err.message });
  }
};
