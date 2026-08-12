# PeopleCore --- Human Resource Management System

::: {align="center"}
**A full-stack HR management platform built with React, Node.js,
Express, MongoDB, and a microservices-based backend.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux
Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind
CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
:::

------------------------------------------------------------------------

## Contents

-   [Overview](#overview)
-   [Key Capabilities](#key-capabilities)
-   [Technology Stack](#technology-stack)
-   [System Architecture](#system-architecture)
-   [Backend Services](#backend-services)
-   [Authentication and
    Authorization](#authentication-and-authorization)
-   [Role-Based Access Control](#role-based-access-control)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [API Reference](#api-reference)
-   [Design System](#design-system)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [License](#license)

------------------------------------------------------------------------

## Overview

**PeopleCore** is a full-stack Human Resource Management System designed
to manage core employee and HR operations through a modular
microservices-based backend and a React single-page application.

The platform separates major HR domains into independent backend
services, with an **API Gateway** providing a single external entry
point. Authentication is handled using **JWT**, passwords are securely
hashed with **bcryptjs**, and MongoDB is used for persistence.

The application provides role-aware workflows for:

-   Employee self-service
-   HR operations
-   Administrative management
-   Attendance
-   Leave management
-   Payroll and payslips
-   Employee profiles
-   Notifications
-   Company announcements
-   Registration and email OTP verification

> **Architecture note:** The current implementation uses MongoDB
> connections configured per service, while the environment
> configuration currently points services to the same PeopleCore MongoDB
> database. This is a practical development setup, but strict production
> microservice isolation would normally use separate databases or
> logical data ownership per service.

------------------------------------------------------------------------

## Key Capabilities

### Authentication and Security

-   User registration with email verification
-   Email OTP verification through a dedicated OTP service
-   JWT-based authentication
-   Password hashing with `bcryptjs`
-   Account approval workflow
-   Role-based authorization middleware
-   Protected frontend routes
-   Separate admin route protection

### Employee Management

-   Employee profile management
-   Employee directory for HR/Admin
-   Department and designation information
-   Join date and location management
-   Profile avatar selection

### Attendance

-   Daily check-in and check-out
-   Automatic timestamp capture
-   Late-arrival detection
-   Half-day detection
-   Attendance history
-   Status tracking
-   HR/Admin attendance statistics

### Leave Management

-   Leave application
-   Multiple leave types
-   Automatic leave-day calculation
-   HR/Admin approval and rejection
-   Leave cancellation
-   Leave history and filtering
-   Notification integration

### Payroll

-   Employee CTC configuration
-   Salary structure calculation
-   Monthly payslip generation
-   Payslip history
-   HR/Admin payroll management
-   Printable payslips
-   INR currency formatting

### Notifications

-   In-app notifications
-   Unread notification count
-   Notification history
-   Mark-all-as-read
-   Clear-all functionality
-   Notifications for account and leave events

### Announcements

-   Company-wide announcements
-   Priority levels
-   Pin/unpin functionality
-   Create, update, and delete operations
-   HR/Admin access control

### Frontend Experience

-   React 19 + Vite SPA
-   Redux Toolkit state management
-   React Router protected routes
-   Responsive layouts
-   Dark/light theme
-   Tailwind CSS styling
-   Mobile, tablet, and desktop support

------------------------------------------------------------------------

## Technology Stack

### Frontend

  Technology           Version Purpose
  ------------------ --------- -----------------------------------
  React                     19 UI development
  Vite                       7 Build tool and development server
  Tailwind CSS               4 Styling and responsive UI
  Redux Toolkit              2 Global state management
  React Router DOM           7 Client-side routing
  Lucide React           0.475 UI icons

### Backend

  Technology              Purpose
  ----------------------- ---------------------------
  Node.js                 JavaScript runtime
  Express.js              REST API framework
  MongoDB                 Data persistence
  Mongoose                MongoDB ODM
  JSON Web Token (JWT)    Authentication
  bcryptjs                Password hashing
  http-proxy-middleware   API Gateway reverse proxy
  dotenv                  Environment configuration

------------------------------------------------------------------------

## System Architecture

PeopleCore uses a **microservices-oriented architecture**. The React
application communicates with the backend through the API Gateway, which
routes requests to the appropriate domain service.

There is **no message broker or asynchronous event bus** in the current
architecture.

``` mermaid
flowchart TB

    USER["User"]

    subgraph CLIENT["Client Layer"]
        REACT["React 19 SPA<br/>Vite"]
    end

    subgraph EDGE["API Access Layer"]
        GATEWAY["API Gateway<br/>Port 5000<br/>Reverse Proxy"]
    end

    subgraph SERVICES["Backend Microservices"]

        AUTH["Auth Service<br/>Port 5001"]
        ADMIN["Admin Service<br/>Port 5002"]
        OTP["OTP Service"]
        USER_SVC["User Service<br/>Port 5004"]
        NOTIFICATION["Notification Service<br/>Port 5005"]
        LEAVE["Leave Service<br/>Port 5006"]
        ATTENDANCE["Attendance Service<br/>Port 5007"]
        PAYROLL["Payroll Service<br/>Port 5008"]

    end

    subgraph DATA["MongoDB"]
        MONGO["PeopleCore MongoDB"]
    end

    subgraph EXTERNAL["External Integration"]
        EMAIL["Email Provider"]
    end

    USER -->|HTTPS| REACT
    REACT -->|HTTPS / REST| GATEWAY

    GATEWAY --> AUTH
    GATEWAY --> ADMIN
    GATEWAY --> OTP
    GATEWAY --> USER_SVC
    GATEWAY --> NOTIFICATION
    GATEWAY --> LEAVE
    GATEWAY --> ATTENDANCE
    GATEWAY --> PAYROLL

    AUTH --> MONGO
    ADMIN --> MONGO
    OTP --> MONGO
    USER_SVC --> MONGO
    NOTIFICATION --> MONGO
    LEAVE --> MONGO
    ATTENDANCE --> MONGO
    PAYROLL --> MONGO

    OTP -->|OTP Email| EMAIL
```

### Architecture Principles

-   **Single external entry point:** the frontend communicates with
    backend APIs through the API Gateway.
-   **Domain separation:** each major HR domain is implemented as an
    independent service.
-   **Independent service processes:** services run independently on
    their configured ports.
-   **JWT-based security:** protected APIs use JWT authentication and
    role-based authorization.
-   **Direct REST communication:** service integrations use HTTP/REST
    rather than a message broker.
-   **Current database model:** services use MongoDB connections, with
    the current environment configuration pointing to the same
    PeopleCore database.

------------------------------------------------------------------------

## Backend Services

  ---------------------------------------------------------------------
  Service                                     Port Responsibility
  -------------------- --------------------------- --------------------
  **API Gateway**                           `5000` Single external
                                                   entry point and
                                                   reverse proxy

  **Auth Service**                          `5001` Registration, login,
                                                   password hashing,
                                                   JWT generation

  **Admin Service**                         `5002` User management,
                                                   approvals,
                                                   announcements

  **OTP Service**            Configured separately Email OTP and
                                                   registration
                                                   verification

  **User Service**                          `5004` Employee profile
                                                   management

  **Notification                            `5005` In-app notifications
  Service**                                        

  **Leave Service**                         `5006` Leave requests and
                                                   approvals

  **Attendance                              `5007` Check-in/out,
  Service**                                        attendance history
                                                   and statistics

  **Payroll Service**                       `5008` Salary structures
                                                   and payslips
  ---------------------------------------------------------------------

### Service Responsibilities

**Auth Service** - Registration - Login - Password hashing - JWT
generation - Authentication-related operations

**Admin Service** - Employee directory - Account approval/rejection -
Role assignment - Announcements

**OTP Service** - Registration OTP generation/verification - Email-based
verification

**User Service** - Employee profile retrieval - Profile updates

**Notification Service** - Notification creation - Notification
retrieval - Unread count - Read/clear operations

**Leave Service** - Leave submission - Leave history - Leave
approval/rejection - Leave cancellation

**Attendance Service** - Check-in - Check-out - Attendance history -
Attendance statistics

**Payroll Service** - Salary structure - CTC configuration - Monthly
payslip generation - Payslip retrieval

------------------------------------------------------------------------

## Authentication and Authorization

The authentication flow is based on JWT.

``` mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant G as API Gateway
    participant A as Auth Service
    participant DB as MongoDB

    U->>F: Enter registration/login details

    F->>G: Authentication request
    G->>A: Route request

    A->>DB: Validate/store credentials
    DB-->>A: Result

    A->>A: Hash/verify password
    A->>A: Generate JWT

    A-->>G: Authentication response
    G-->>F: JWT response
    F-->>U: Authenticated session

    U->>F: Access protected feature
    F->>G: Request + JWT
    G->>A: Validate/authenticate request

    A-->>G: Authorization result
    G->>F: Protected resource response
```

### Security Controls

-   Passwords are hashed with `bcryptjs`.
-   JWT is used for authentication.
-   Protected backend endpoints use authentication middleware.
-   Role-based authorization is applied to restricted operations.
-   React uses protected routes for authenticated pages.
-   Administrative pages use dedicated route protection.

> The exact JWT transport mechanism should be kept aligned with the
> implementation in the individual services. Do not document HttpOnly
> cookies unless the current code explicitly implements them.

------------------------------------------------------------------------

## Role-Based Access Control

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

------------------------------------------------------------------------

## Project Structure

``` text
peoplecore/
├── backend/
│   ├── api-gateway/           # Reverse proxy entry point (Port 5000)
│   ├── auth-service/          # Registration, login and JWT (Port 5001)
│   ├── admin-service/         # Users, approvals and announcements (Port 5002)
│   ├── otp-service/           # Email OTP verification
│   ├── user-service/          # Employee profile CRUD (Port 5004)
│   ├── notification-service/  # In-app notifications (Port 5005)
│   ├── leave-service/         # Leave requests and approvals (Port 5006)
│   ├── attendance-service/    # Check-in/out and statistics (Port 5007)
│   └── payroll-service/       # Salary and payslips (Port 5008)
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

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Install the following:

-   **Node.js** v18 or later
-   **npm** v9 or later
-   **MongoDB** local installation or MongoDB Atlas

### 1. Clone the Repository

``` bash
git clone https://github.com/your-username/peoplecore.git
cd peoplecore
```

### 2. Configure Environment Variables

Create a `.env` file inside each backend service that requires
environment configuration.

Example:

``` env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Services that communicate with the notification service may additionally
require:

``` env
NOTIFICATION_SERVICE_URL=http://localhost:5005
```

> **Security:** Never commit real `.env` files, JWT secrets, database
> credentials, or email credentials to source control. Use
> `.env.example` files for shareable configuration templates.

### 3. Start the Backend Services

Open a terminal for each service and run:

``` bash
cd backend/api-gateway
npm install
node index.js
```

Repeat the same process for the backend services:

``` text
auth-service
admin-service
otp-service
user-service
notification-service
leave-service
attendance-service
payroll-service
```

Use the configured port for each service.

### 4. Start the Frontend

``` bash
cd frontend/peoplecore
npm install
npm run dev
```

The Vite development server runs on:

``` text
http://localhost:5173
```

### 5. Optional Demo Data

If the repository contains the seed script:

``` bash
node seed.js
```

Use this only when demo data is required.

------------------------------------------------------------------------

## Environment Variables

  ---------------------------------------------------------------------
  Variable                           Purpose
  ---------------------------------- ----------------------------------
  `PORT`                             Service port

  `MONGO_URI`                        MongoDB connection string

  `JWT_SECRET`                       JWT signing/verification secret

  `NOTIFICATION_SERVICE_URL`         Notification service URL for
                                     services that call it
  ---------------------------------------------------------------------

### Example

``` env
PORT=5006
MONGO_URI=mongodb://127.0.0.1:27017/peoplecore
JWT_SECRET=your_secure_secret
NOTIFICATION_SERVICE_URL=http://localhost:5005
```

For production, use environment-specific secrets and credentials rather
than committing them to the repository.

------------------------------------------------------------------------

## API Reference

### Auth Service --- `:5001`

  Method   Endpoint         Access   Description
  -------- ---------------- -------- ----------------------
  `GET`    `/health`        Public   Health check
  `POST`   `/register`      Public   Register a new user
  `POST`   `/login`         Public   Authenticate a user
  `GET`    `/profile/:id`   Public   Fetch a user profile

### Admin Service --- `:5002`

  --------------------------------------------------------------------------
  Method          Endpoint                   Access          Description
  --------------- -------------------------- --------------- ---------------
  `GET`           `/health`                  Public          Health check

  `GET`           `/users`                   Admin, HR       List employees

  `GET`           `/account-approval`        Admin, HR       List pending
                                                             registrations

  `PUT`           `/approve-user/:id`        Admin, HR       Approve a user

  `PUT`           `/reject-user/:id`         Admin, HR       Reject a
                                                             registration

  `GET`           `/announcements`           Authenticated   List
                                                             announcements

  `POST`          `/announcements`           Admin, HR       Create
                                                             announcement

  `PUT`           `/announcements/:id`       Admin, HR       Update
                                                             announcement

  `DELETE`        `/announcements/:id`       Admin, HR       Delete
                                                             announcement

  `PUT`           `/announcements/:id/pin`   Admin, HR       Toggle
                                                             announcement
                                                             pin
  --------------------------------------------------------------------------

### User Service --- `:5004`

  Method   Endpoint         Access          Description
  -------- ---------------- --------------- --------------------------
  `GET`    `/health`        Public          Health check
  `GET`    `/user/me`       Authenticated   Get current user profile
  `PUT`    `/user/update`   Authenticated   Update profile

### Notification Service --- `:5005`

  ------------------------------------------------------------------------------
  Method         Endpoint                        Access          Description
  -------------- ------------------------------- --------------- ---------------
  `GET`          `/health`                       Public          Health check

  `GET`          `/notifications`                Authenticated   Get
                                                                 notifications

  `GET`          `/notifications/unread-count`   Authenticated   Get unread
                                                                 count

  `POST`         `/notifications`                Authenticated   Create
                                                                 notification

  `PUT`          `/notifications/read-all`       Authenticated   Mark
                                                                 notifications
                                                                 as read

  `DELETE`       `/notifications/clear-all`      Authenticated   Clear
                                                                 notifications
  ------------------------------------------------------------------------------

### Leave Service --- `:5006`

  Method     Endpoint                Access          Description
  ---------- ----------------------- --------------- ----------------------------
  `GET`      `/health`               Public          Health check
  `POST`     `/leaves`               Authenticated   Submit leave
  `GET`      `/leaves/my`            Authenticated   Get personal leave history
  `GET`      `/leaves/all`           Admin, HR       Get all leaves
  `PUT`      `/leaves/:id/approve`   Admin, HR       Approve leave
  `PUT`      `/leaves/:id/reject`    Admin, HR       Reject leave
  `DELETE`   `/leaves/:id`           Owner, HR       Cancel/delete leave

### Attendance Service --- `:5007`

  Method   Endpoint                 Access          Description
  -------- ------------------------ --------------- ---------------------------
  `GET`    `/health`                Public          Health check
  `POST`   `/attendance/checkin`    Authenticated   Check in
  `PUT`    `/attendance/checkout`   Authenticated   Check out
  `GET`    `/attendance/today`      Authenticated   Get today's record
  `GET`    `/attendance/my`         Authenticated   Get attendance history
  `GET`    `/attendance/all`        Admin, HR       Get all attendance
  `GET`    `/attendance/stats`      Admin, HR       Get attendance statistics

### Payroll Service --- `:5008`

  ----------------------------------------------------------------------------
  Method         Endpoint                       Access          Description
  -------------- ------------------------------ --------------- --------------
  `GET`          `/health`                      Public          Health check

  `GET`          `/payroll/my-structure`        Authenticated   Get salary
                                                                structure

  `GET`          `/payroll/my-payslips`         Authenticated   Get payslip
                                                                history

  `GET`          `/payroll/payslip/:id`         Owner, HR       Get payslip
                                                                details

  `GET`          `/payroll/all-structures`      Admin, HR       Get all salary
                                                                structures

  `POST`         `/payroll/salary-structure`    Admin, HR       Configure
                                                                employee CTC

  `POST`         `/payroll/generate-payslips`   Admin, HR       Generate
                                                                monthly
                                                                payslips

  `GET`          `/payroll/all-payslips`        Admin, HR       Get all
                                                                payslips
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

## Design System

  Area                     Specification
  ------------------------ ---------------------------------------------
  Primary color            Indigo `#6366f1`
  Typography               System font stack / Inter
  Dark palette             `slate-950`, `slate-900`, `slate-800`
  Light palette            `slate-50`, `white`, `slate-200`
  UI style                 Glassmorphism with subtle transparency
  Animations               Fade, scale, loading and status transitions
  Responsive breakpoints   `sm` 640px, `md` 768px, `lg` 1024px

------------------------------------------------------------------------

## Testing

PowerShell test scripts are available for key services.

``` powershell
# Leave Service
.\test_leave_service.ps1

# Attendance Service
.\test_attendance.ps1

# Payroll Service
.\test_payroll.ps1

# Full test suite
.\test_full_suite.ps1
```

------------------------------------------------------------------------

## Contributing

1.  Fork the repository.
2.  Create a feature branch:

``` bash
git checkout -b feature/your-feature
```

3.  Make your changes.
4.  Commit with a clear message:

``` bash
git commit -m "Add your change"
```

5.  Push the branch:

``` bash
git push origin feature/your-feature
```

6.  Open a Pull Request.

------------------------------------------------------------------------

## License

This project is licensed under the **MIT License**.

------------------------------------------------------------------------

::: {align="center"}
:::

::: {align="center"}
**Developed by Pratik Kamble**
:::
