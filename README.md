# PeopleCore HRMS

PeopleCore HRMS is a microservices-based Human Resource Management System designed to manage employees, HR operations, authentication, and administrative workflows. The system is built using modern full-stack technologies with a scalable architecture, secure authentication, and modular service design.

This project demonstrates real-world enterprise architecture using React, Node.js, Express, REST APIs, and microservices principles.

---

## Architecture Overview

PeopleCore follows a microservices architecture where each service handles a specific business responsibility.

Services included:

- Authentication Service – login, registration, JWT authentication
- OTP Service – email-based OTP verification
- Admin Service – manage organization settings and users
- HR Service – manage HR workflows and employee lifecycle
- Employee Service – employee profile, records, and data management
- Frontend Client – React-based user interface

High-level flow:

Client → API Gateway / Services → Database

Each service is independent and communicates via REST APIs.

---

## Tech Stack

Frontend

- React.js
- Redux Toolkit
- JavaScript (ES6+)
- HTML5, CSS3
- Tailwind CSS / Bootstrap
- Axios

Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

Database

- MongoDB / SQL (depending on service)

Other Tools

- Git and GitHub
- Postman
- npm
- Microservices architecture

---

## Features

Authentication

- User registration and login
- JWT-based authentication
- Role-based access control
- Secure password handling

OTP Service

- Generate OTP
- Send OTP to email
- Verify OTP for authentication and account actions

Admin Module

- Manage users and roles
- Control system access
- Manage organizational data

HR Module

- Add employees
- Update employee records
- Manage employee lifecycle

Employee Module

- View profile
- Update personal information
- Access HR data

Frontend

- Responsive UI
- Protected routes
- State management using Redux

---

## Project Structure

```
PeopleCore/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── auth-service/
├── otp-service/
├── admin-service/
├── hr-service/
├── employee-service/
│
└── README.md
```

---

## Installation and Setup

Clone the repository

```
git clone https://github.com/yourusername/peoplecore.git
cd peoplecore
```

Install frontend dependencies

```
cd frontend
npm install
npm start
```

Install backend dependencies (example)

```
cd auth-service
npm install
npm run dev
```

Repeat for each service.

---

## Environment Variables Example

Create a `.env` file in each service.

```
PORT=5000
JWT_SECRET=your_secret_key
DB_URI=your_database_connection
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## Example API Endpoint

Authentication login endpoint:

```
POST /api/auth/login
```

Request body:

```
{
  "email": "user@email.com",
  "password": "password123"
}
```

Response:

```
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "role": "employee"
  }
}
```

---

## Example Express Route

```
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = generateToken(user);

  res.json({ token, user });
});
```

---

## Example Protected Route (JWT Middleware)

```
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  next();
};
```

---

## Frontend API Call Example

```
import axios from "axios";

const login = async (data) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};
```

---

## Microservices Advantages in this Project

- Independent deployment
- Scalable services
- Clear separation of responsibilities
- Easier maintenance
- Production-ready architecture

---

## Security

- JWT Authentication
- Role-based authorization
- Password encryption
- Secure API access

---

## Learning Outcomes

This project demonstrates:

- Microservices architecture implementation
- Full stack development with React and Node.js
- REST API design
- Authentication and authorization
- Real-world HRMS workflow design

---

## Future Improvements

- API Gateway integration
- Docker containerization
- Kubernetes deployment
- CI/CD pipeline
- Logging and monitoring

---

## Author

Pratik Kamble  
React JS Developer and Mentor  
Full Stack Developer (MERN)
