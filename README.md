# 🚀 PeopleCore HRMS — Enterprise Microservices HR Platform

[![Architecture: Microservices](https://img.shields.io/badge/Architecture-Microservices-indigo?style=for-the-badge&logo=node.js)](https://github.com/Pratik765/peoplecore)
[![Frontend: React + Redux + Tailwind](https://img.shields.io/badge/Frontend-React_%7C_Redux_%7C_Tailwind-blue?style=for-the-badge&logo=react)](https://github.com/Pratik765/peoplecore)
[![Backend: Express.js](https://img.shields.io/badge/Backend-Express.js-black?style=for-the-badge&logo=express)](https://github.com/Pratik765/peoplecore)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://github.com/Pratik765/peoplecore)

**PeopleCore HRMS** is an enterprise-grade, microservices-based Human Resource Management System designed to handle workforce management, administrative account approvals, real-time notifications, company announcements, and role-gated employee lifecycles.

Built with a decoupled microservice architecture (Node.js/Express) and a modern glassmorphic React frontend featuring dynamic Light/Dark mode themes.

---

## 🏛️ Microservices Architecture

The system consists of independent, decoupled Node.js microservices coordinated through a central API Gateway:

```
                                  ┌─────────────────────────┐
                                  │   React 19 Frontend     │
                                  │   (Vite + Redux + TW)   │
                                  └────────────┬────────────┘
                                               │ (HTTP / REST)
                                               ▼
                                  ┌─────────────────────────┐
                                  │   API Gateway (5000)    │
                                  └────────────┬────────────┘
                                               │
        ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
        ▼                  ▼                   ▼                   ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ Auth Service  │  │ Admin Service │  │ User Service  │  │ Notification  │  │  OTP Service  │
│  (Port 5001)  │  │  (Port 5002)  │  │  (Port 5004)  │  │Service (5005) │  │  (Port 5003)  │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                   │                   │                  │
        └──────────────────┴───────────────────┼───────────────────┴──────────────────┘
                                               ▼
                                  ┌─────────────────────────┐
                                  │  MongoDB (peoplecore)   │
                                  └─────────────────────────┘
```

### Microservice Catalog

| Service | Port | Primary Responsibilities |
|---|---|---|
| **API Gateway** | `5000` | Central proxy routing, CORS resolution, request logging & fallback handling. |
| **Auth Service** | `5001` | Account Registration, Login, JWT generation/validation, Bcrypt password hashing. |
| **Admin Service** | `5002` | Employee directory (`/users`), pending registration approvals (`/account-approval`), and announcements CRUD (`/announcements`). |
| **OTP Service** | `5003` | Email-based OTP generation & verification workflows. |
| **User Service** | `5004` | Dynamic user profile details (`/user/me`), account status management. |
| **Notification Service** | `5005` | 100% database-driven in-app notifications, unread count polling, and bulk actions. |

---

## ✨ Implemented Core Features

### 1. 🔑 Role-Based Authentication & Security (RBAC)
- **JWT Authorization**: Secured endpoints using Bearer token verification.
- **Account Approval Workflow**: New registrations start as `PENDING` and require Admin or HR approval before granting portal access.
- **Strict Role-Gated UI & API Access**:
  - 🛡️ **ADMINISTRATOR**: Full control over users directory, pending request approvals, announcements, and system metrics.
  - 💼 **HR MANAGER**: Manage employee rosters, review pending requests, post announcements, and view HR metrics.
  - 👤 **EMPLOYEE**: Access personal dashboard, leave applications, company announcements, profile settings, and notifications.
- **Quick Sign-In Auto-fill**: Pre-configured test accounts for instant role-based testing:
  - Admin: `aditya.sharma@peoplecore.in` (`aditya123`)
  - HR: `priya.patel@peoplecore.in` (`priya123`)
  - Employee: `rahul.verma@peoplecore.in` (`rahul123`)

---

### 2. 🔔 Feature #1: Real-Time Notification System
- **100% Database-Driven**: Notifications are stored as real documents in MongoDB's `notifications` collection per user.
- **Top Navbar Bell Dropdown**: Interactive `NotificationBell` with live unread badge count (`99+`) and 30-second polling.
- **Full Notification Hub Page (`/notifications`)**:
  - Filter notifications by `All`, `Unread`, and `Read`.
  - Bulk actions: **Mark All as Read**, **Clear All Notifications**, and **Delete Single Notification**.
  - **⚡ One-Click Simulation**: Real-time notification test generator to verify live unread badge behavior.

---

### 3. 📢 Feature #2: Announcements & Company Notices Board
- **Company-Wide Notices Board (`/announcements`)**:
  - Post notices with priority tags (`URGENT`, `EVENT`, `INFO`).
  - Pin important announcements to the top of the board.
  - Full CRUD modal workflows for ADMIN & HR roles.
- **Automated Broadcast Notifications**: Creating a new announcement automatically fires targeted notification documents to all accepted employees.
- **Dashboard Integration**: Displays the latest 2 notices on the main home dashboard (`Home.jsx`).

---

### 4. 🎨 Enterprise UI/UX Design & Top Navbar Layout
- **Glassmorphic Aesthetic**: Vibrant color tokens, backdrop blur effects, micro-animations, and custom cards.
- **Dual Theme Support**: One-click instant toggle between **Light Mode** and **Dark Mode**.
- **Top Navbar Header**: Houses Access Role badge, Notification Bell dropdown, Theme switch, User Profile badge, and a prominent Sign Out button.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM v7, Redux Toolkit, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), Bcrypt.js, CORS, Morgan / Custom Access Loggers
- **Database**: MongoDB (Mongoose ODM)
- **Architecture**: Microservices Architecture + API Gateway Proxy Pattern

---

## 🚀 Getting Started & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running on `mongodb://127.0.0.1:27017`

### 1. Clone the Repository
```bash
git clone https://github.com/Pratik765/peoplecore.git
cd peoplecore
```

### 2. Start Microservices Backend
Run each microservice in separate terminal windows (or use Node background tasks):

```bash
# 1. Auth Service (Port 5001)
cd backend/auth-service
npm install
node seed.js  # Seeds 15 initial users into MongoDB
node index.js

# 2. Admin Service (Port 5002)
cd backend/admin-service
npm install
node seedAnnouncements.js  # Seeds company announcements into MongoDB
node index.js

# 3. User Service (Port 5004)
cd backend/user-service
npm install
node index.js

# 4. Notification Service (Port 5005)
cd backend/notification-service
npm install
node seed.js  # Seeds notification documents into MongoDB
node index.js

# 5. API Gateway (Port 5000)
cd backend/api-gateway
npm install
node index.js
```

### 3. Start Frontend Client
```bash
cd frontend/peoplecore
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to view the application!

---

## 📂 Repository Directory Structure

```
peoplecore/
├── backend/
│   ├── api-gateway/            # Central proxy server (Port 5000)
│   ├── admin-service/          # Users directory, approvals & announcements (Port 5002)
│   ├── auth-service/           # Auth, registration, login & JWT (Port 5001)
│   ├── notification-service/   # Database-driven notification system (Port 5005)
│   ├── otp-service/            # Email OTP verification service (Port 5003)
│   └── user-service/           # Profile & dynamic user details (Port 5004)
│
├── frontend/peoplecore/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Announcements, Notifications, Users, etc.
│   │   ├── routes/             # ProtectedRoute.jsx, AdminRoute.jsx
│   │   ├── store/              # Redux slices (userSlice, themeSlice, notificationSlice)
│   │   ├── App.jsx             # Main application layout wrapper
│   │   └── main.jsx            # React router config & store provider
│   └── index.html
│
└── README.md
```

---

## 📝 12-Feature Roadmap Progress

- [x] **Feature 1: Real-Time Notification System** (Completed & Database-driven)
- [x] **Feature 2: Announcements & Company Notices Board** (Completed & Integrated)
- [ ] **Feature 3: Attendance & Punch-In/Out Tracker** (Next up)
- [ ] **Feature 4: Leave Management & Request System**
- [ ] **Feature 5: Employee Payroll & Payslip Generator**
- [ ] **Feature 6: Performance Review & KPI Tracker**
- [ ] **Feature 7: Organization Hierarchy & Org Chart**
- [ ] **Feature 8: Onboarding & Offboarding Checklist**
- [ ] **Feature 9: Document Storage & Compliance Vault**
- [ ] **Feature 10: Shift Scheduling & Roster Planner**
- [ ] **Feature 11: Expense Claim & Reimbursement Portal**
- [ ] **Feature 12: Helpdesk & Internal IT/HR Ticketing**

---

## 👤 Author

**Pratik Kamble**  
*MERN Stack Developer & Trainer*  
GitHub: [@Pratik765](https://github.com/Pratik765)
