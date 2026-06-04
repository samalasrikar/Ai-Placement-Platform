import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if available in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Resilient API mocks fallback to ensure the UI operates even if backend is offline
const mockData = {
  student: {
    student: { id: 1, full_name: 'Alex Carter', roll_no: 'CS2023089', department: 'Computer Science & Engineering', phone: '+15559812', cgpa: 9.15, resume_url: '#', profile_completed: 85 },
    profileCompletion: 85,
    recentApplications: [
      { id: 1, job_title: 'Software Engineer I (Frontend)', company_name: 'Google', status: 'interview_scheduled', applied_at: '2026-06-01T10:00:00Z', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
      { id: 2, job_title: 'Cloud Software Engineer (Backend)', company_name: 'Microsoft', status: 'applied', applied_at: '2026-06-02T14:30:00Z', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' }
    ],
    upcomingInterviews: [
      { id: 1, job_title: 'Software Engineer I (Frontend)', company_name: 'Google', schedule_time: '2026-06-10T10:00:00Z', meeting_link: 'https://meet.google.com/abc-defg-hij', recruiter_notes: 'React rendering, styling with Tailwind, hooks details.', status: 'scheduled' }
    ],
    recommendedJobs: [
      { id: 1, title: 'Software Engineer I (Frontend)', company_name: 'Google', salary: '$120,000 - $140,000', location: 'Mountain View, CA', experience_level: '0-2 Years', matchPercentage: 92, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
      { id: 2, title: 'Cloud Software Engineer (Backend)', company_name: 'Microsoft', salary: '$135,000 - $160,000', location: 'Redmond, WA', experience_level: '1-3 Years', matchPercentage: 81, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
      { id: 3, title: 'Machine Learning Associate', company_name: 'Google', salary: '$150,000 - $170,000', location: 'San Francisco, CA', experience_level: '2-4 Years', matchPercentage: 70, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }
    ],
    notifications: [
      { id: 1, title: 'Interview Scheduled', message: 'Your interview for Frontend Engineer at Google has been scheduled for June 10th, 2026.', is_read: 0, created_at: new Date() },
      { id: 2, title: 'Welcome to Placement Hub', message: 'Complete your student profile to start receiving AI job recommendations.', is_read: 1, created_at: new Date() }
    ]
  },
  recruiter: {
    recruiter: { id: 1, full_name: 'Sarah Jenkins', phone: '+15550199', is_approved: 1, company_id: 1 },
    metrics: { totalJobs: 3, totalApplicants: 12, interviewsScheduled: 4 },
    jobs: [
      { id: 1, title: 'Software Engineer I (Frontend)', salary: '$120,000 - $140,000', location: 'Mountain View, CA (Hybrid)', experience_level: '0-2 Years', skills_required: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"], status: 'approved' },
      { id: 3, title: 'Machine Learning Associate', salary: '$150,000 - $170,000', location: 'San Francisco, CA', experience_level: '2-4 Years', skills_required: ["Python", "TensorFlow", "PyTorch", "MySQL"], status: 'approved' }
    ],
    statusAnalytics: [
      { status: 'applied', count: 5 },
      { status: 'shortlisted', count: 3 },
      { status: 'interview_scheduled', count: 2 },
      { status: 'selected', count: 1 },
      { status: 'rejected', count: 1 }
    ]
  },
  admin: {
    metrics: { totalStudents: 145, totalRecruiters: 28, totalJobs: 64, placementRate: 78 },
    latestJobs: [
      { id: 1, title: 'Software Engineer I (Frontend)', company_name: 'Google', recruiter_name: 'Sarah Jenkins', salary: '$120k - $140k', location: 'Mountain View', status: 'approved' },
      { id: 2, title: 'Cloud Software Engineer (Backend)', company_name: 'Microsoft', recruiter_name: 'David Chen', salary: '$135k - $160k', location: 'Redmond', status: 'approved' }
    ],
    recruiters: [
      { id: 1, full_name: 'Sarah Jenkins', email: 'recruiter@google.com', company_name: 'Google', is_approved: 1 },
      { id: 2, full_name: 'David Chen', email: 'recruiter@microsoft.com', company_name: 'Microsoft', is_approved: 1 },
      { id: 3, full_name: 'Mark Miller', email: 'mark@netflix.com', company_name: 'Netflix', is_approved: 0 }
    ],
    students: [
      { id: 1, full_name: 'Alex Carter', email: 'student@placement.com', roll_no: 'CS2023089', department: 'Computer Science & Engineering', cgpa: 9.15, profile_completed: 85 }
    ]
  }
};

// Wrap API calls with standard error capturing fallback
export const handleApiCall = async (apiCall, mockFallbackValue) => {
  try {
    const res = await apiCall();
    return res.data;
  } catch (error) {
    console.warn('Network call failed, returning local mock placeholder: ', error.message);
    return mockFallbackValue;
  }
};

export default api;
export { mockData };
