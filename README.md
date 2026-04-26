# 🧠 Task Manager - Backend

A RESTful backend API for a Task Management System built with Node.js, Express, and MongoDB.  
It handles authentication, task management, and file uploads, following a modular MVC architecture.

---

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Secure JWT-based authentication
- Protected routes for task operations
- Admin/Member role-based access control (RBAC)

### 📋 Task Management
- Create, update, delete tasks
- Fetch user-specific tasks vs Admin view
- Task status tracking (Pending, In Progress, Completed)
- **Automatic Progress Calculation** based on checklist items

### 📁 File Uploads
- Upload attachments for tasks
- Stored in `uploads/` directory

### 🧪 Automated Testing
- **13+ Integration Tests** covering Auth, Tasks, and User management
- **GitHub Actions CI** pipeline for automated testing on push
- **In-Memory MongoDB** for fast and isolated test execution

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Testing**: Vitest, Supertest, MongoDB Memory Server
- **CI/CD**: GitHub Actions

---

## ⚙️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://root:rootpassword@localhost:27017/taskmanager?authSource=admin
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=123456
CLIENT_URL=http://localhost:5173
```

### 3. Run with Docker (Database only)
```bash
docker compose up -d
```

### 4. Development
```bash
npm run dev
```

---

## 🧪 Testing

I use **Vitest** for integration testing. These tests use an in-memory MongoDB database, so no setup is required!

### Run All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

---

## 🛡️ CI/CD (GitHub Actions)

A GitHub Actions workflow is configured at `.github/workflows/backend-ci.yml`. 
Every time code is pushed to the `main` branch, GitHub will:
1. Initialize a clean Node.js environment.
2. Install dependencies.
3. Run all tests.
4. Report pass/fail status directly in your Repository.
