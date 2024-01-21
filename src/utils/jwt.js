import './config/env.js'
import jwt from 'jsonwebtoken'

export class jwtAuth {
    async newToken(userEmail) {
        // access token 발급

        return jwt.sign({ email: userEmail }, process.env.SECRET_KEY, {
            expiresIn: '30m',
            algorithm: 'SHA512',
        }) // 만료시간 30분
    }

    async verifyToken(token, user) {
        // access token 유효성 검사

        let decoded = null

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
            return {
                // token값이 유효하다면 디코딩된 userID 를 리턴
                ok: true,
                id: decoded.id,
            }
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            }
        }
    }

    async refreshToken() {
        // refresh token 발급
        return (refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
            // refresh token은 payload 없이 발급
            expiresIn: '14d', // 보통 refresh token의 유효기간은 2주로 설정정
            algorithm: 'SHA512',
        }))
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
            const refreshToken = getToken(userID) // DB에 userID로 조회하여 refresh token 가져오기
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
