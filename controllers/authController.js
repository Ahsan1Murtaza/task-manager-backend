import userModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const {name, email, password, profileImageUrl, adminInviteToken} = req.body

        // Check if user already exists
        const userExists = await userModel.findOne({email})
        if (userExists) {
            return res.status(400).json({message: "User Already Exists"})
        }

        // Determine user role
        let role = 'member'
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = 'admin'
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create a new user
        const user = await userModel.create({
            name,
            email,
            password : hashedPassword,
            profileImageUrl,
            role,
        })

        // Return user data with jwt
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        })

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        // Return user data with jwt
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({message: "User not Found"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (!user) {
            return res.status(404).json({message: "User Not Found"})
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImageUrl: updatedUser.profileImageUrl,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}


export {registerUser, loginUser, getUserProfile, updateUserProfile}