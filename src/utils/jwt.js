import '../config/env.js'
import jwt from 'jsonwebtoken'

export class jwtAuth {
    async newToken(userId) {
        try {
            const accessTK = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
                expiresIn: '30m',
                algorithm: 'HS512', // SHA512
            }) // callback 함수가 없으므로 sign은 동기적으로 실행, 문자열 jwt를 발급
            return accessTK
        } catch (err) {
            return false
        }
    }

    async verifyToken(token) {
        // access token 유효성 검사

        try {
            const result = jwt.verify(token, process.env.SECRET_KEY)
            return result
        } catch (err) {
            return false
        }
    }

    async refreshToken() {
        // refresh token 발급
        try {
            const refreshTk = jwt.sign({}, process.env.SECRET_KEY, {
                // refresh token은 payload 없이 발급
                expiresIn: '14d', // 보통 refresh token의 유효기간은 2주로 설정
                algorithm: 'HS512', // SHA512
            })

            return refreshTk
        } catch (err) {
            return false
        }
    }

    async refreshVerify(token, user) {
        // refresh token와 DB에서 조회한 값이 일치하는 지 유효성 검증

        async function getToken(id) {
            const userToken = await user.findOne({
                where: { id }, // 특정 userID를 갖는 유저를 찾는다
            })

            return userToken
        }

        try {
            const refreshToken = await getToken(user.user_id) // DB에 userID로 조회하여 refresh token 가져오기
            if (token === refreshToken) {
                try {
                    jwt.verify(token, process.env.SECRET_KEY)
                    return true
                } catch (err) {
                    return false
                }
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }
}
