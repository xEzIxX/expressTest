import '../config/env.js'
import jwt from 'jsonwebtoken'

export function newToken(userId, userNickname) {
        // payload에 사용자의 id, nickname을 넣어준다.
        try {
            return jwt.sign(
                { user_id: userId, user_nickname: userNickname },
                process.env.SECRET_AK_KEY,
                {
                    algorithm: 'HS512',
                    expiresIn: '30m', // SHA512
                }
            ) // 동기적으로 실행, 문자열 jwt를 발급
        } catch (err) {
            throw new Error('access 토큰 발급 실패')
        }
}