# 🏢 PeopleCore — HR Management System

<div align="center">

**A production-grade, microservices-based Human Resource Management System built with React, Node.js, Express, and MongoDB.**

![PeopleCore Banner](https://img.shields.io/badge/PeopleCore-HR%20Platform-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE3IDIxdi0yYTQgNCAwIDAgMC00LTRIOUQ0IDQgMCAwIDAgNSA5djJtMTIgMHYtMmE0IDQgMCAwIDAtMy0zLjg3TTEzIDdhNCA0IDAgMCAxIDQgNE0xIDIxdi0yYTQgNCAwIDAgMSA0LTRIOUQ0IDQgMCAwIDAgNSA5djIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=for-the-badge&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Microservices](#-microservices)
- [Features](#-features)
- [Role-Based Access Control](#-role-based-access-control)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

**PeopleCore** is a full-stack, enterprise-grade Human Resource Management System (HRMS) designed for modern companies. Built on a **microservices architecture**, it provides a clean separation of concerns across 8 independent backend services — each owning its own database connection, business logic, and REST API.

The frontend is a premium **React + Vite + TailwindCSS** Single Page Application featuring dark/light themes, glassmorphic design, smooth animations, and complete mobile responsiveness across all device sizes and orientations.

**Company**: PeopleCore HR Solutions — *Pune, Maharashtra*

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 7 | Build Tool & Dev Server |
| TailwindCSS | 4 | Utility-first CSS Styling |
| Redux Toolkit | 2 | Global State Management |
| React Router DOM | 7 | Client-side Routing |
| Lucide React | 0.475 | Icon Library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API Microservices |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication & Authorization |
| bcryptjs | Password Hashing |
| http-proxy-middleware | API Gateway Reverse Proxy |
| dotenv | Environment Configuration |

---

## 🏗 Architecture

PeopleCore follows a **Microservices Architecture** where each core business domain is handled by an independent service. An **API Gateway** acts as the single entry point for all external requests.

```
┌─────────────────────────────────────────────┐
│                  React Frontend               │
│         (Vite SPA — localhost:5173)          │
└────────────────────┬────────────────────────┘
                     │
              ┌──────▼──────┐
              │  API Gateway │
              │  Port: 5000  │
              └──────┬───────┘
                     │
     ┌───────────────┼───────────────────────┐
     │               │                       │
     ▼               ▼                       ▼
┌─────────┐   ┌──────────┐           ┌─────────────┐
│  Auth   │   │  Admin   │    ...    │   Payroll   │
│  :5001  │   │  :5002   │           │    :5008    │
└─────────┘   └──────────┘           └─────────────┘
     │               │                       │
     └───────────────┴───────────────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │  Atlas/Local │
              └─────────────┘
```

---

## ⚙️ Microservices

| Service | Port | Responsibility |
|---|---|---|
| **API Gateway** | `5000` | Single entry point — reverse-proxies all requests to downstream services |
| **Auth Service** | `5001` | User registration, login, JWT token generation, password hashing |
| **Admin Service** | `5002` | User management, account approvals/rejections, announcements CRUD |
| **User Service** | `5004` | Employee profile management (view & edit personal details, avatar) |
| **Notification Service** | `5005` | Real-time in-app notifications (bell badge, mark-read, clear-all) |
| **Leave Service** | `5006` | Leave application, approval/rejection, cancel, leave history |
| **Attendance Service** | `5007` | Daily check-in/check-out, attendance history, HR analytics stats |
| **Payroll Service** | `5008` | Salary structure configuration, monthly payslip generation, payslip printing |

---

## ✨ Features

### 🔐 Authentication & Security
- **Secure Registration** with email, name, and hashed password (bcryptjs)
- **Email OTP Verification** via a dedicated OTP service before login
- **JWT Authentication** — tokens expire in 24 hours
- **Account Approval Workflow** — newly registered users enter `PENDING` state; an Admin or HR must approve them before they can log in
- **Role-based middleware** (`verifyToken` + `authorizeRoles`) guards every protected endpoint

### 👤 Role-Based Access Control (3 Roles)
- **ADMIN** — Full system access: user management, approvals, announcements, all payroll/attendance data
- **HR** — Employee management, leave approvals, payroll management, announcements
- **EMPLOYEE** — Personal attendance, leave requests, salary slips, profile management

### 🏠 Dynamic Dashboard
- Personalized welcome banner with role-specific metrics
- **Real-time microservice health monitoring** — live status of all 7 services
- Role-specific stats: Leave balance & pending requests (Employee), Pending approvals & user count (HR/Admin)
- Recent announcements preview
- One-click refresh of all live backend metrics

### ⏱ Attendance Management
- **Check In / Check Out** — one click to record daily attendance with an auto-captured timestamp
- **Late Arrival Detection** — auto-flagged if check-in is after 9:30 AM
- **Half-Day Detection** — auto-flagged if total worked hours are under 5 hours
- **Status Tracking** — `PRESENT`, `LATE`, `HALF_DAY`, `ABSENT`
- **Attendance History** — paginated, filterable by date and status
- **HR Analytics Dashboard** — live today's stats: Present, Late, Half-Day, Absent counts

### 🌴 Leave Management
- Apply for **7 leave types**: Paid Annual Leave, Sick Leave, Casual Leave, Emergency Leave, Maternity Leave, Paternity Leave, Unpaid Leave
- Select start & end dates with automatic total-day calculation
- **Approve / Reject** leave requests (HR/Admin only)
- **Delete / Cancel** leave requests (own requests for employees; any request for HR/Admin)
- Leave history with rich filters: status, leave type, date range
- Instant notification to HR when a leave is submitted
- Instant notification to employee when leave is approved or rejected

### 💰 Payroll & Salary Slips
- **Salary Structure** — auto-configured per employee with Annual CTC breakdown:
  - Monthly Basic (50% of CTC)
  - HRA (25% of Monthly Gross)
  - Special Allowance (remaining 25%)
  - PF Deduction (12% of Basic, capped at ₹6,000)
  - TDS / Income Tax (5% of Gross)
  - Net Take-Home Salary
- **CTC Configuration** — HR/Admin can update any employee's CTC; all components recalculate automatically
- **Monthly Payslip Generation** — one-click batch generation for all active employees; dynamic current month/year
- **Official Printable Payslip** modal — professional company letterhead with earnings vs. deductions table, ready for **Print / Save as PDF**
- HR Scope Toggle — switch between "My Payslips" and "Company Payroll Management" (all employees)
- Currency formatted in ₹ INR (Indian Numbering System)

### 🔔 Notifications
- Real-time **bell badge** with unread count in the top navigation
- Dropdown panel showing the latest 5 notifications
- Full **Notifications page** with pagination and rich filter by type
- Types: Account Approved, Account Rejected, Leave Applied, Leave Approved, Leave Rejected, Announcement, System
- **Mark All as Read** / **Clear All** actions
- Notifications fire automatically on: account approval, account rejection, leave submission, leave approval, leave rejection, announcement posts

### 📢 Announcements
- Company-wide announcements posted by HR or Admin
- **Priority levels**: `INFO` (blue), `WARNING` (amber), `CRITICAL` (red)
- **Pin / Unpin** announcements for prominence
- Edit & Delete (HR/Admin only)
- Filter by priority; newest-first ordering with pinned items always on top
- Recent announcements preview on the dashboard

### 👥 Users Directory (HR/Admin)
- Searchable employee directory with role, status, department, and designation
- **Account Approval Queue** — approve pending users and assign their role (ADMIN, HR, or EMPLOYEE) in one action
- Paginated list with real-time backend count

### 🧑 Employee Profile
- View and edit personal details: Name, Phone, Department, Designation, Join Date, Location, Bio
- Select from **5 preset avatars** (Unsplash photos)
- Changes are persisted to the backend user-service database

### 🌓 Dark / Light Theme
- System-wide theme toggle (moon/sun icon in the navbar)
- Persisted in Redux store; applied instantly across all pages
- Glassmorphic dark mode with slate-900/950 palette
- Clean light mode with slate-50/white palette

### 📱 Full Responsiveness
- **Mobile (Portrait & Landscape)**: Slide-over hamburger drawer sidebar, scrollable auth pages, stacked card grids
- **Tablet**: 2-column grids, compact navigation
- **Desktop**: Persistent left sidebar, 4-column metric grids, wide table layouts
- All modals constrained with `max-h-[90vh] overflow-y-auto` for small screens

---

## 🔐 Role-Based Access Control

| Feature | EMPLOYEE | HR | ADMIN |
|---|:---:|:---:|:---:|
| View Dashboard | ✅ | ✅ | ✅ |
| My Attendance | ✅ | ✅ | ✅ |
| HR Attendance Stats | ❌ | ✅ | ✅ |
| Apply Leave | ✅ | ✅ | ✅ |
| Approve/Reject Leave | ❌ | ✅ | ✅ |
| View All Leaves | ❌ | ✅ | ✅ |
| My Payslip | ✅ | ✅ | ✅ |
| Configure Employee CTC | ❌ | ✅ | ✅ |
| Generate Payslips | ❌ | ✅ | ✅ |
| View All Payslips | ❌ | ✅ | ✅ |
| My Profile | ✅ | ✅ | ✅ |
| Users Directory | ❌ | ✅ | ✅ |
| Account Approvals | ❌ | ✅ | ✅ |
| Post Announcements | ❌ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |

---

## 📁 Project Structure

```
peoplecore/
├── backend/
│   ├── api-gateway/          # Reverse proxy entry point (Port 5000)
│   ├── auth-service/         # Register, Login, JWT (Port 5001)
│   ├── admin-service/        # Users, Approvals, Announcements (Port 5002)
│   ├── otp-service/          # Email OTP for registration verification
│   ├── user-service/         # Employee profile CRUD (Port 5004)
│   ├── notification-service/ # In-app notifications (Port 5005)
│   ├── leave-service/        # Leave requests & approvals (Port 5006)
│   ├── attendance-service/   # Check-in/out & stats (Port 5007)
│   └── payroll-service/      # Salary & payslips (Port 5008)
│
└── frontend/
    └── peoplecore/
        ├── public/
        └── src/
            ├── components/
            │   ├── Login.jsx
            │   ├── Signup.jsx
            │   ├── VerifyOtp.jsx
            │   ├── Home.jsx
            │   ├── Sidebar.jsx
            │   ├── Navbar.jsx
            │   ├── Attendance.jsx
            │   ├── MyLeaves.jsx
            │   ├── Payroll.jsx
            │   ├── Profile.jsx
            │   ├── Users.jsx
            │   ├── PendingRequest.jsx
            │   ├── Notifications.jsx
            │   ├── NotificationBell.jsx
            │   ├── Announcements.jsx
            │   └── Modal.jsx
            ├── routes/
            │   ├── ProtectedRoute.jsx
            │   └── AdminRoute.jsx
            ├── store/
            │   ├── peopleCoreStore.js
            │   ├── userSlice.js
            │   ├── themeSlice.js
            │   └── notificationSlice.js
            ├── App.jsx
            ├── main.jsx
            └── index.css
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or above
- **npm** v9+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/peoplecore.git
cd peoplecore
```

---

### 2. Set Up Environment Variables

> **All services share the same MongoDB database and JWT secret.** Create a `.env` file inside each backend service folder using the exact values below.

**`backend/auth-service/.env`**
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

**`backend/admin-service/.env`**
```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

**`backend/user-service/.env`**
```env
PORT=5004
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

**`backend/notification-service/.env`**
```env
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

**`backend/leave-service/.env`**
```env
PORT=5006
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
NOTIFICATION_SERVICE_URL=http://localhost:5005
```

**`backend/attendance-service/.env`**
```env
PORT=5007
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

**`backend/payroll-service/.env`**
```env
PORT=5008
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=peoplecore_secret_key_12345
```

> **Note**: Change `JWT_SECRET` to a strong, random secret in production. For MongoDB Atlas, replace the URI with your Atlas connection string.

---

### 3. Install & Start All Backend Services

Open **8 terminal windows** and run each service:

```bash
# Terminal 1 — API Gateway
cd backend/api-gateway && npm install && node index.js

# Terminal 2 — Auth Service
cd backend/auth-service && npm install && node index.js

# Terminal 3 — Admin Service
cd backend/admin-service && npm install && node index.js

# Terminal 4 — User Service
cd backend/user-service && npm install && node index.js

# Terminal 5 — Notification Service
cd backend/notification-service && npm install && node index.js

# Terminal 6 — Leave Service
cd backend/leave-service && npm install && node index.js

# Terminal 7 — Attendance Service
cd backend/attendance-service && npm install && node index.js

# Terminal 8 — Payroll Service
cd backend/payroll-service && npm install && node index.js
```

> **Tip**: All services log `Service running at http://localhost:PORT` on successful startup.

---

### 4. Start the Frontend

```bash
cd frontend/peoplecore
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### 5. Seed Demo Data (Optional)

A seed script is available to pre-populate demo users, announcements, and leave records:

```bash
node seed.js
```

---

## 📡 API Reference

### Auth Service (`:5001`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and receive JWT |
| `GET` | `/profile/:id` | Public | Fetch user profile by ID |

### Admin Service (`:5002`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `GET` | `/users` | ADMIN, HR | List all employees |
| `GET` | `/account-approval` | ADMIN, HR | List pending registrations |
| `PUT` | `/approve-user/:id` | ADMIN, HR | Approve user with role |
| `PUT` | `/reject-user/:id` | ADMIN, HR | Reject user registration |
| `GET` | `/announcements` | All Auth | List all announcements |
| `POST` | `/announcements` | ADMIN, HR | Post new announcement |
| `PUT` | `/announcements/:id` | ADMIN, HR | Edit announcement |
| `DELETE` | `/announcements/:id` | ADMIN, HR | Delete announcement |
| `PUT` | `/announcements/:id/pin` | ADMIN, HR | Toggle pin status |

### User Service (`:5004`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `GET` | `/user/me` | All Auth | Get logged-in user's profile |
| `PUT` | `/user/update` | All Auth | Update personal profile |

### Notification Service (`:5005`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `GET` | `/notifications` | All Auth | Fetch all my notifications |
| `GET` | `/notifications/unread-count` | All Auth | Get unread notification count |
| `POST` | `/notifications` | All Auth | Create a notification (internal use) |
| `PUT` | `/notifications/read-all` | All Auth | Mark all notifications as read |
| `DELETE` | `/notifications/clear-all` | All Auth | Clear all notifications |

### Leave Service (`:5006`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `POST` | `/leaves` | All Auth | Submit a new leave request |
| `GET` | `/leaves/my` | All Auth | Get my leave history |
| `GET` | `/leaves/all` | ADMIN, HR | Get all employee leaves |
| `PUT` | `/leaves/:id/approve` | ADMIN, HR | Approve a leave request |
| `PUT` | `/leaves/:id/reject` | ADMIN, HR | Reject a leave request |
| `DELETE` | `/leaves/:id` | Owner / HR | Cancel or delete a leave request |

### Attendance Service (`:5007`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `POST` | `/attendance/checkin` | All Auth | Record daily check-in |
| `PUT` | `/attendance/checkout` | All Auth | Record daily check-out |
| `GET` | `/attendance/today` | All Auth | Get today's attendance record |
| `GET` | `/attendance/my` | All Auth | Get my attendance history |
| `GET` | `/attendance/all` | ADMIN, HR | Get all employees' attendance |
| `GET` | `/attendance/stats` | ADMIN, HR | Today's attendance summary stats |

### Payroll Service (`:5008`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `GET` | `/payroll/my-structure` | All Auth | Get my CTC & salary breakdown |
| `GET` | `/payroll/my-payslips` | All Auth | Get my payslip history |
| `GET` | `/payroll/payslip/:id` | Owner / HR | Get single payslip details |
| `GET` | `/payroll/all-structures` | ADMIN, HR | All employee salary structures |
| `POST` | `/payroll/salary-structure` | ADMIN, HR | Configure employee CTC |
| `POST` | `/payroll/generate-payslips` | ADMIN, HR | Batch generate monthly payslips |
| `GET` | `/payroll/all-payslips` | ADMIN, HR | All generated payslips |

---

## 🔧 Environment Variables

> **Important**: All services share the same `JWT_SECRET`. Use the same value across all `.env` files.

| Variable | Description |
|---|---|
| `PORT` | Port number for the service |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (shared across all services) |
| `NOTIFICATION_SERVICE_URL` | URL for the notification service (used by leave & admin services) |

---

## 🎨 Design System

- **Primary Color**: Indigo (`#6366f1`)
- **Font**: System font stack (Inter, sans-serif)
- **Dark Palette**: `slate-950`, `slate-900`, `slate-800`
- **Light Palette**: `slate-50`, `white`, `slate-200`
- **Glassmorphism**: `backdrop-blur-xl` + semi-transparent backgrounds
- **Animations**: Fade-in, scale-up modals, spin loader, pulse status dot
- **Responsive Breakpoints**: `sm` (640px) → `md` (768px) → `lg` (1024px)

---

## 🧪 Testing

PowerShell test scripts are included for all key services:

```powershell
# Test Leave Service API
.\test_leave_service.ps1

# Test Attendance Service API
.\test_attendance.ps1

# Test Payroll Service API
.\test_payroll.ps1

# Run Full Test Suite
.\test_full_suite.ps1
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes with a clear message
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ by Team PeopleCore — Pune, Maharashtra**

*Empowering organizations with intelligent, seamless HR management.*

</div>
