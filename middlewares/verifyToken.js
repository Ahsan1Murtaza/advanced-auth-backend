import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            throw new Error("UnAuthorized - No token provided")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            throw new Error("UnAuthorized - Invalid token")
        }

        req.userId = decoded.userId

        next()
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}