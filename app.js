import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js'
import reportRouter from './routes/reportRoutes.js'

const app = express()

// Middleware to handle cors
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middlewares
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/reports', reportRouter)

// Get current file path
const __filename = fileURLToPath(import.meta.url)
// Get current directory path
const __dirname = path.dirname(__filename)

// Server upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

export default app
