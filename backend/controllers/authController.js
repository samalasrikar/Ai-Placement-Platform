const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_ai_neon_glow_secret_key_123!';

exports.register = async (req, res) => {
  const { email, password, role, name, rollNo, department, phone, cgpa, companyName, companyWebsite, industry } = req.body;

  if (!email || !password || !role || !name) {
    return res.status(400).json({ message: 'Please provide all required registration fields' });
  }

  try {
    // Check if email already registered
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user in system
    const [userRes] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hash, role]
    );
    const userId = userRes.insertId;

    if (role === 'student') {
      const parsedCgpa = cgpa ? Number(cgpa) : 0.0;
      const [studentRes] = await db.query(
        'INSERT INTO students (user_id, full_name, roll_no, department, phone, cgpa) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, rollNo || `ROLL-${Date.now().toString().slice(-6)}`, department || 'General Science', phone || '', parsedCgpa]
      );
      const studentId = studentRes.insertId;

      // Initialize empty details row
      await db.query(
        'INSERT INTO student_details (student_id, education, skills, certifications, projects, achievements) VALUES (?, ?, ?, ?, ?, ?)',
        [
          studentId,
          JSON.stringify({ high_school: "", ug_college: "", ug_degree: "", ug_year: new Date().getFullYear(), ug_cgpa: parsedCgpa }),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([])
        ]
      );
    } else if (role === 'recruiter') {
      let companyId = null;
      if (companyName) {
        // Create company
        const [compRes] = await db.query(
          'INSERT INTO companies (name, website, industry, description) VALUES (?, ?, ?, ?)',
          [companyName, companyWebsite || '', industry || '', `Description for ${companyName}`]
        );
        companyId = compRes.insertId;
      }
      
      await db.query(
        'INSERT INTO recruiters (user_id, company_id, full_name, phone, is_approved) VALUES (?, ?, ?, ?, ?)',
        [userId, companyId, name, phone || '', 1] // Auto-approved in this mockup for convenience
      );
    }

    // Sign JWT token
    const payload = { id: userId, email, role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, email, role, name }
    });

  } catch (err) {
    console.error('Registration error: ', err);
    res.status(500).json({ message: 'Internal server registration error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials. User does not exist' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password' });
    }

    let name = 'Admin User';
    if (user.role === 'student') {
      const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (students && students.length > 0) name = students[0].full_name;
    } else if (user.role === 'recruiter') {
      const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [user.id]);
      if (recruiters && recruiters.length > 0) name = recruiters[0].full_name;
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name
      }
    });

  } catch (err) {
    console.error('Login error: ', err);
    res.status(500).json({ message: 'Server login error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const [users] = await db.query('SELECT id, email, role, created_at FROM users WHERE id = ?', [userId]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = { ...users[0] };

    if (role === 'student') {
      const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
      if (students && students.length > 0) {
        const student = students[0];
        profileData.studentInfo = student;
        const [details] = await db.query('SELECT * FROM student_details WHERE student_id = ?', [student.id]);
        if (details && details.length > 0) {
          profileData.details = {
            education: typeof details[0].education === 'string' ? JSON.parse(details[0].education) : details[0].education,
            skills: typeof details[0].skills === 'string' ? JSON.parse(details[0].skills) : details[0].skills,
            certifications: typeof details[0].certifications === 'string' ? JSON.parse(details[0].certifications) : details[0].certifications,
            projects: typeof details[0].projects === 'string' ? JSON.parse(details[0].projects) : details[0].projects,
            achievements: typeof details[0].achievements === 'string' ? JSON.parse(details[0].achievements) : details[0].achievements,
          };
        }
      }
    } else if (role === 'recruiter') {
      const [recruiters] = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
      if (recruiters && recruiters.length > 0) {
        const recruiter = recruiters[0];
        profileData.recruiterInfo = recruiter;
        if (recruiter.company_id) {
          const [companies] = await db.query('SELECT * FROM companies WHERE id = ?', [recruiter.company_id]);
          if (companies && companies.length > 0) {
            profileData.companyInfo = companies[0];
          }
        }
      }
    }

    res.json(profileData);
  } catch (err) {
    console.error('Profile fetching error: ', err);
    res.status(500).json({ message: 'Error retrieving user profile info', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }
  
  // Simulation: check if user exists
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'No account found with this email' });
  }
  
  res.json({ message: 'Reset instruction credentials dispatched to registered email' });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);
    res.json({ message: 'Password reset successful. You may now login.' });
  } catch (err) {
    res.status(500).json({ message: 'Password update error', error: err.message });
  }
};
