import jwt from 'jsonwebtoken'
import userModel from '../models/User.js'

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization

        if (token && token.startsWith('Bearer')) {
            token = token.split(' ')[1] // Extract Token

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await userModel.findById(decoded.id).select('-password')

            next()
        }
        else{
            throw new Error('Not Authorized, no token')
        }
    } catch (error) {
        res.status(401).json({message: "Token Failed", error: error.message})
    }
}

// Middleware for admin only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    }
    else {
        res.status(403).json({message: "Access denied! Admin Only"})
    }
}

export {protect, adminOnly}