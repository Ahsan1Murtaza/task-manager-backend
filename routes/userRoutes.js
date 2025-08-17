import express from 'express'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'
import { deleteUser, getUserById, getUsers } from '../controllers/userController.js'

const router = express.Router()

// User Management Routes
router.get('/', protect, adminOnly, getUsers) // Get all Users (Admin Only)
router.get('/:id', protect, getUserById) // Get a specific user
router.delete('/:id', protect, adminOnly, deleteUser) // Delete user (Admin Only)


export default router