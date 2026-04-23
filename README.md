# 🧠 Task Manager - Backend

A RESTful backend API for a Task Management System built with Node.js, Express, and MongoDB.  
It handles authentication, task management, and file uploads, following a modular MVC architecture.

This backend powers the Task Manager frontend dashboard.

---

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Secure authentication using tokens (JWT or similar)
- Protected routes for task operations

### 📋 Task Management
- Create, update, delete tasks
- Fetch user-specific tasks
- Task status tracking (pending, in-progress, completed)

### 📁 File Uploads
- Upload attachments for tasks
- Stored in `uploads/` directory

### 🧱 Architecture
- MVC pattern (Models, Controllers, Routes)
- Middleware-based request handling
- Clean separation of business logic

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (or your DB)
- Multer (for file uploads)
- JWT (for authentication)
