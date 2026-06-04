# Nexus AI - Placement Management Platform

Nexus AI is a futuristic, AI-Powered Placement Management Platform featuring a premium dark glassmorphism theme, glowing animations, and automated placement utilities for Students, Recruiters, and Administrators.

---

## Technical Stack & Ports

- **Frontend**: React 19, Vite, Tailwind CSS (v4), Framer Motion, Recharts, Lucide React (Default Port: `5173`)
- **Backend**: Node.js, Express.js (Default Port: `5000`)
- **Database**: MySQL (Fallback simulator included in `backend/config/db.js`)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt

---

## Directory Structure

```text
ai-placement-platform/
├── backend/            # Express REST API application
│   ├── config/         # SQL connection config & memory fallback
│   ├── controllers/    # Route handler controllers (Auth, Student, Recruiter, Admin, AI)
│   ├── middleware/     # JWT Auth checking & Role-based gates
│   ├── models/         # Database MySQL schemas (schema.sql)
│   ├── routes/         # Express routing definitions
│   └── server.js       # Express server entry point
└── frontend/           # React 19 client application (Vite-built)
    ├── index.html      # Document frame
    ├── src/
    │   ├── components/ # Global layout pieces (Navbar, Sidebar, Floating Chatbot)
    │   ├── context/    # User Auth state and api hook context
    │   ├── layouts/    # Master dashboard grid frame
    │   ├── pages/      # Route templates (Home, Student, Recruiter, Admin pages)
    │   ├── routes/     # Protected role routers and path configurations
    │   ├── services/   # Axios client configuration with mock callbacks
    │   └── main.jsx    # DOM mounting root
```

---

## Getting Started

### 1. Database Setup (MySQL)
Create a MySQL database and populate it with seed data:
```bash
mysql -u root -p < backend/models/schema.sql
```
*Note: If MySQL is not running on the system, the server automatically defaults to an in-memory JS simulated database mirroring the schema seeds, so all operations remain fully functional.*

### 2. Launch the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server starts listening on `http://localhost:5000`.

### 3. Launch the Frontend Dev Server
```bash
cd ../frontend
npm install
npm run dev
```
The Vite client starts listening on `http://localhost:5173`. Open this URL in your web browser.

---

## Test Accounts Login Credentials

All mock accounts use the password `password123`:

- **Student Desk**: `student@placement.com`
- **Recruiter Desk**: `recruiter@google.com`
- **Platform Admin Desk**: `admin@placement.com`

*Note: For testing convenience, clickable shortcut buttons are placed on the bottom of the login card to autofill these details instantly.*
