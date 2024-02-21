import '../config/env.js'
import jwt from 'jsonwebtoken'

export function tokenChecker() {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decoded.userId
            next()
        } catch (err) {
            return next(err)
        }
    }
}
