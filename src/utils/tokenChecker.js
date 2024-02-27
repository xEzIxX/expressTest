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
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: '만료된 토큰' })
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).send({ message: '유효하지 않은 토큰' })
            } else if (err.name === 'TypeError') {
                return res.status(401).send({ message: '잘못된 형식의 토큰' })
                //TypeError: Cannot read properties of undefined (reading 'split')
            } else {
                return next(err)
            }
        }
    }
}
