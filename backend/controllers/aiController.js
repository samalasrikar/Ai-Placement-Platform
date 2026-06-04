const db = require('../config/db');

// AI Resume Analyzer
exports.analyzeResume = async (req, res) => {
  const userId = req.user.id;
  const { fileName } = req.body; // simulated upload path

  try {
    const [students] = await db.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    const student = students[0];

    // Read student skills to simulate ATS scoring
    const [details] = await db.query('SELECT skills FROM student_details WHERE student_id = ?', [student.id]);
    const studentSkills = details && details.length > 0 ? (typeof details[0].skills === 'string' ? JSON.parse(details[0].skills) : details[0].skills) : [];

    // Simulated parsing logic
    const atsScore = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // range: 65 - 95
    const qualityScore = Math.floor(Math.random() * (98 - 70 + 1)) + 70; // range: 70 - 98

    const keywords = ["TypeScript", "Docker", "GraphQL", "Kubernetes", "Next.js", "Redis", "Jest", "CI/CD"];
    const missingKeywords = keywords.filter(k => !studentSkills.some(s => s.toLowerCase() === k.toLowerCase())).slice(0, 3);
    
    const analysisData = {
      missing_keywords: missingKeywords,
      suggestions: [
        "Quantify your project metrics (e.g., 'Optimized REST API database queries resulting in a 35% response speedup').",
        missingKeywords.length ? `Incorporate standard keywords like [${missingKeywords.join(', ')}] in your resume experience section to match modern vacancies.` : "Verify font structures and eliminate complex graphics formatting.",
        "Add a section detailing cloud infrastructure or testing utilities."
      ],
      strengths: [
        student.cgpa > 8 ? `Strong academic profile with a CGPA of ${student.cgpa}.` : "Solid foundational coursework mapping.",
        studentSkills.length ? `Diversified core skills including: ${studentSkills.slice(0, 4).join(', ')}.` : "Clean resume template architecture."
      ],
      weaknesses: [
        "Limited evidence of software unit testing libraries (e.g. Jest, Cypress).",
        "Sparse impact statements for side projects."
      ]
    };

    // Store in resumes table
    const [resumeRes] = await db.query(
      `INSERT INTO resumes (student_id, file_name, file_path, ats_score, quality_score, analysis_data) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student.id, fileName || 'resume.pdf', `/uploads/resumes/${fileName || 'resume.pdf'}`, atsScore, qualityScore, JSON.stringify(analysisData)]
    );

    // Update students resume_url reference
    await db.query('UPDATE students SET resume_url = ? WHERE id = ?', [`/uploads/resumes/${fileName || 'resume.pdf'}`, student.id]);

    res.json({
      id: resumeRes.insertId,
      fileName: fileName || 'resume.pdf',
      atsScore,
      qualityScore,
      analysisData
    });

  } catch (err) {
    console.error('Error analyzing resume: ', err);
    res.status(500).json({ message: 'AI Analysis engine failed to complete', error: err.message });
  }
};

// AI Career Chatbot
exports.chatbotChat = async (req, res) => {
  const { message, history = [] } = req.body;
  const userRole = req.user.role;

  if (!message) {
    return res.status(400).json({ message: 'Empty message sent to assistant' });
  }

  const query = message.toLowerCase();
  let response = '';

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    response = `Hello! I am your AI Career Mentor. I am here to help you draft resume bullets, recommend roadmap guidelines, recommend technical skills, or practice placement interviews. What role are we targeting today?`;
  } else if (query.includes('resume') || query.includes('ats')) {
    response = `A great resume should follow the Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]". Make sure to keep formatting standard, avoid multiple columns or heavy tables that confuse parsers, and list keywords that match the job description. Try out our ATS Resume Analyzer page on the sidebar!`;
  } else if (query.includes('interview') || query.includes('mock')) {
    response = `Interviews typically test three parts: Data Structures & Algorithms (DSA), System Design, and Behavioral/HR questions. I can help generate customized mock tracks. Ask me: 'Give me 3 react developer mock questions' or 'Give me 3 HR questions'.`;
  } else if (query.includes('react') || query.includes('frontend') || query.includes('css')) {
    response = `For Frontend roles, master:
1. JavaScript core: Closures, Event Loops, Promises, Async/Await.
2. React details: Hooks (useEffect/useMemo/useCallback), Virtual DOM, and state handlers.
3. CSS: Layout styling (Flexbox/Grid), responsive design, Tailwind rules.
4. Testing: Jest & Testing Library.
Let me know if you would like a mock interview question on these!`;
  } else if (query.includes('backend') || query.includes('node') || query.includes('sql')) {
    response = `To succeed as a Backend engineer, focus on:
1. Node.js & Express: Request pipelines, middleware configurations, error handlers.
2. Database Schema Design: SQL indexes, transactions, normalization/denormalization.
3. API Protocols: REST vs. GraphQL, WebSockets, gRPC.
4. Scale & Architecture: Caching (Redis), microservices, queues (RabbitMQ/Kafka).`;
  } else if (query.includes('road') || query.includes('map') || query.includes('career')) {
    response = `Here is a custom 4-step AI Career Roadmap for software jobs:
1. **Foundation**: Build strong data structure and SQL query skills.
2. **Specialization**: Choose a domain (Frontend, Backend, ML, or Cloud DevOps) and create 2 major projects.
3. **Optimizations**: Add docker containers, tests, and CI/CD triggers to your project workflows.
4. **Interview Prep**: Practice behavioral mock cards and solve coding problems on arrays/graphs.`;
  } else {
    response = `I appreciate your query regarding: "${message}". To succeed in placements, combine a strong resume, targeted skill badges, and active mock practices. How can I help you refine your skills or prepare for placements?`;
  }

  // Simulate a slight typing latency
  setTimeout(() => {
    res.json({
      role: 'assistant',
      content: response
    });
  }, 400);
};

// AI Interview Prep
exports.getMockInterviewQuestions = async (req, res) => {
  const { role = 'Software Engineer', type = 'technical' } = req.body;

  let questions = [];

  if (type === 'technical') {
    if (role.toLowerCase().includes('frontend') || role.toLowerCase().includes('react')) {
      questions = [
        { id: 1, question: "What is the difference between useMemo and useCallback in React? Under what scenarios do they optimize performance?", category: "React Hooks" },
        { id: 2, question: "Explain the Javascript Event Loop, Microtasks (Promises), and Macrotasks (setTimeout). What is their execution priority?", category: "JavaScript Core" },
        { id: 3, question: "How would you handle routing rendering, caching optimization, and lazy loading in a massive frontend framework?", category: "System Architecture" }
      ];
    } else if (role.toLowerCase().includes('backend') || role.toLowerCase().includes('node')) {
      questions = [
        { id: 1, question: "Explain database indexing in MySQL. What are B-Trees, and how do index markers boost query speed while raising write costs?", category: "Databases" },
        { id: 2, question: "How does Express middleware execute? Explain the flow of next() and how you implement a custom global rate limiter.", category: "Express.js" },
        { id: 3, question: "What are microservice design patterns? Contrast API Gateway vs Service Mesh architectures for secure routing.", category: "System Architecture" }
      ];
    } else {
      questions = [
        { id: 1, question: "Explain the Time and Space complexity of Quick Sort vs Merge Sort. When is one preferred over the other?", category: "Algorithms" },
        { id: 2, question: "Explain RESTful API design rules. Describe the appropriate use cases for GET, POST, PUT, and DELETE verbs.", category: "Web Standards" },
        { id: 3, question: "How do you manage race conditions when multiple microservices access the same database record simultaneously?", category: "Databases" }
      ];
    }
  } else {
    // HR Questions
    questions = [
      { id: 1, question: "Describe a time you faced a difficult technical bug or structural blocker. How did you diagnose the issue and align with teammates?", category: "Conflict & Problem Solving" },
      { id: 2, question: "Why are you interested in joining our engineering team, and how do you prioritize tasks when operating under close deadlines?", category: "Motivation" },
      { id: 3, question: "Explain a situation where you had to lead a project team or recommend a critical architecture change. How did you build consensus?", category: "Leadership & Collaboration" }
    ];
  }

  res.json({
    role,
    type,
    questions
  });
};

exports.submitInterviewFeedback = async (req, res) => {
  const { questionId, userAnswer } = req.body;

  if (!userAnswer) {
    return res.status(400).json({ message: 'Answer string is required for assessment feedback.' });
  }

  const sentimentScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60; // range 60-95
  
  res.json({
    score: sentimentScore,
    grammarFeedback: "Excellent grammar structure and vocabulary usage. Well organized delivery.",
    contentFeedback: "You successfully outlined the core theoretical constructs. To improve, we recommend referencing real-life projects where you implemented these concepts, as well as discussing performance implications.",
    recommendation: "Review documentation concepts and practice explaining them out loud."
  });
};
