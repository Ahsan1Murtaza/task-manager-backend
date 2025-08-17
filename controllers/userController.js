import taskModel from '../models/Task.js'
import userModel from '../models/User.js'
import bcrypt from 'bcryptjs'

// @desc    Get all users (Admin Only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({role: 'member'}).select('-password')

        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await taskModel.countDocuments({
                    assignedTo: user._id,
                    status: 'Pending',
                })
                const inProgressTasks = await taskModel.countDocuments({
                    assignedTo: user._id,
                    status: 'In Progress',
                })
                const completedTasks = await taskModel.countDocuments({
                    assignedTo: user._id,
                    status: 'Completed',
                })

                return {
                    ...user._doc, // Include all existing user data
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                }
            })
        )
        res.status(200).json(usersWithTaskCounts)
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}
// @desc    Get all users (Admin Only)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({message: "User Not Found"})
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}
// @desc    Delete user by id
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({message: "User Not Found"})
        }

        await userModel.deleteOne({_id: req.params.id})

        res.status(200).json({message: "User Deleted Successfully"})
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

export {getUsers, getUserById, deleteUser}