import './config/env.js'
import jwt from 'jsonwebtoken'

export class jwtAuth {
    async newToken(userEmail) {
        // access token 발급

        try {
            const accessTK = await jwt.sign(
                { email: userEmail },
                process.env.SECRET_KEY,
                {
                    expiresIn: '30m',
                    algorithm: 'SHA512',
                }
            ) // callback 함수가 없으므로 sign은 동기적으로 실행, 문자열 jwt를 발급

            return accessTK
        } catch (err) {
            return false
        }
    }

    async verifyToken(token, user) {
        // access token 유효성 검사

        let decodedPayload = null
        let result = {}

        try {
            decodedPayload = await jwt.verify(token, process.env.SECRET_KEY)
            result = {
                // token값이 유효하다면 디코딩된 Payload 를 리턴
                ok: true,
                Payload: decodedPayload,
            }
        } catch (err) {
            result = {
                ok: false,
                message: err.message,
            }
        }
        return result
    }

    async refreshToken() {
        // refresh token 발급
        try {
            const refreshTk = await jwt.sign({}, process.env.SECRET_KEY, {
                // refresh token은 payload 없이 발급
                expiresIn: '14d', // 보통 refresh token의 유효기간은 2주로 설정
                algorithm: 'SHA512',
            })

            return refreshTk
        } catch (err) {
            return false
        }
    }

    async refreshVerify(token, userID) {
        // refresh token 유효성 검증

        async function getToken(id) {
            const userToken = await user.findOne({
                where: { id }, // 특정 userID를 갖는 유저를 찾는다
            })

            return userToken
        }

        try {
            const refreshToken = await getToken(userID) // DB에 userID로 조회하여 refresh token 가져오기
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
