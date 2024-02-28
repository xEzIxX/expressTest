import '../config/env.js'
import jwt from 'jsonwebtoken'

export function tokenChecker() {
    return async (req, res, next) => {
        try {
            console.log('req.headers.cookie : ', req.headers.cookie)

            const token = req.cookies.token
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decoded.userId

            console.log('토큰 체크 미들웨어 userId : ', req.userId)
            next()
        } catch (err) {
            let tokenErr
            console.log('토큰 에러 발생 : ', err)
            if (err.name === 'TokenExpiredError') {
                tokenErr = { message: '만료된 토큰' }
            } else if (err.name === 'JsonWebTokenError') {
                tokenErr = { message: '유효하지 않은 토큰' }
            } else if (err.name === 'TypeError') {
                tokenErr = { message: '잘못된 형식의 토큰' }
                // TypeError: Cannot read properties of undefined (reading 'split')
            } else {
                return next(err)
            }

            req.tokenMessage = tokenErr

            next()
        }
    }
}
