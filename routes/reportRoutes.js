import express from 'express'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'
import { exportTasksReport, exportUsersReport } from '../controllers/reportController.js'

const router = express.Router()

// Report Routes

router.get('/export/tasks', protect, adminOnly, exportTasksReport) // Export all tasks as Excel/Pdf
router.get('/export/users', protect, adminOnly, exportUsersReport) // Export all users as Excel/Pdf

export default router