import '../config/env.js'
import jwt from 'jsonwebtoken'

export class jwtAuth {
    newToken(userId) {
        try {
            return jwt.sign({ id: userId }, process.env.SECRET_AK_KEY, {
                algorithm: 'HS512', // SHA512
            }) // 동기적으로 실행, 문자열 jwt를 발급
        } catch (err) {
            throw new Error('access 토큰 발급 실패')
        }
    }

    verifyToken(token) {
        // access token 유효성 검사

        try {
            return jwt.verify(token, process.env.SECRET_AK_KEY)
        } catch (err) {
            throw new Error('access 토큰 유효성 검사 실패')
        }
    }

    refreshToken() {
        // refresh token 발급
        try {
            return jwt.sign({}, process.env.SECRET_FK_KEY, {
                // refresh token은 payload 없이 발급
                expiresIn: '14d', // 보통 refresh token의 유효기간은 2주로 설정
                algorithm: 'HS512', // SHA512
            })
        } catch (err) {
            throw new Error('refresh 토큰 발급 실패')
        }
    }

    async refreshVerify(token) {
        // refresh token 유효성 검증

        try {
            return jwt.verify(token, process.env.SECRET_FK_KEY)
        } catch (err) {
            throw new Error('refresh token 유효성 검사 실패')
        }
    }
}
