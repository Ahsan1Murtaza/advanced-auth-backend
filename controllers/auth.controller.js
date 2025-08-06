import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

import{ User} from '../models/user.model.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js'

export const signup = async(req, res) => {
    const {name, email, password} = req.body

    try {
        if (!name || !email || !password){
            throw new Error("All Fields are required")
        }
    
        const userAlreadyExists = await User.findOne({email})
    
        if (userAlreadyExists){
            throw new Error("User already exists")
        }  
        
        const hashedPassword = bcryptjs.hashSync(password, 10)

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            name,
            email,
            password : hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        await user.save()

        // Token
        generateTokenAndSetCookie(res, user._id)

        // Send Verification Email
        await sendVerificationEmail(user.email, user.verificationToken)

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            }
        })

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }

}

export const verifyEmail = async (req, res)=>{
    const {code} = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // Check if token is still valid
        })
        
        if (!user){
            return res.status(400).json({success: false, message: "Invalid or Expired Verification Code"})
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await user.save()

        await sendWelcomeEmail(user.email, user.name) // It is mailtrap builtin template

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            },
        })
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user){
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = bcryptjs.compare(password, user.password)

        if (!isPasswordValid){
            throw new Error("Invalid credentials")
        }

        user.lastLogin = new Date()
        await user.save()

        generateTokenAndSetCookie(res, user._id)

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            }
        })


    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const logout = (req, res) => {
    res.clearCookie('token') // token is the name of the cookie set in generateTokenAndSetCookie
    res.status(200).json({success: true, message: "Logged out successfully"})
}

export const forgotPassword = async (req, res) =>{
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        if (!user){
            throw new Error("User not found")
        }

        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        // Send reset password email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success: true, message: "Reset password email sent successfully"})

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() } // Check if token is still valid
        })

        if (!user) {
            throw new Error("Invalid or Expired Reset Token")
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        await sendResetPasswordSuccessEmail(user.email)

        res.status(200).json({success: true, message: "Password reset successfully"})
        
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            throw new Error("No User Found")
        }

        res.status(200).json({
            success: true,
            message: "User is Authenticated",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            }
        })
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}