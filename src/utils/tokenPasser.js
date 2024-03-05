import '../config/env.js'
import jwt from 'jsonwebtoken'

export function tokenPasser() {
    return async (req, res, next) => {
        try {
            console.log('req.headers.cookie : ', req.headers.cookie)

            const token = req.cookies.token
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decoded.userId

            console.log('토큰 전달 미들웨어 userId만 넘겨줌 : ', req.userId)
            next()

        } catch (err) {
            console.log('토큰 에러 발생 : ', err)
            let message

            if (err.name === 'TokenExpiredError') {
                message = '만료된 토큰'
            } else if (err.name === 'JsonWebTokenError') {
                message = '유효하지 않은 토큰'
            } else if (err.name === 'TypeError') {
                message = '잘못된 형식의 토큰'
                // token이 undefined일 때
                // TypeError: Cannot read properties of undefined (reading 'split')
            } else {
                return next(err) // 에러 핸들러로 이동
            }

            req.tokenErrMsg = message
            // req.userId 는 undefined로 넘겨준다
            // else를 제외한 경우에는 err를 발생시키지 않고, 그냥 에러 메세지만 req에 넘겨줌

            next()
        }
    }
}
