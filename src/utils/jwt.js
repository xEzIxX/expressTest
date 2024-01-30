import '../config/env.js'
import jwt from 'jsonwebtoken'

export class jwtAuth {
    newToken(userId) {
        try {
            return jwt.sign({ id: userId }, process.env.SECRET_AK_KEY, {
                algorithm: 'HS512',
                expiresIn: '30m', // SHA512
            }) // 동기적으로 실행, 문자열 jwt를 발급
        } catch (err) {
            throw new Error('access 토큰 발급 실패')
        }
    }

    verifyToken(token) {
        // access token 유효성 검사,
        // 유효하면 payload반환, 아니라면 throw err

        try {
            return jwt.verify(token, process.env.SECRET_AK_KEY)
        } catch (err) {
            throw new Error('access 토큰 유효성 검사 실패')
        }
    }
}
