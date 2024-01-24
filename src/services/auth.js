import { getHash } from '../utils/crypto.js'
import { jwtAuth } from '../utils/jwt.js'
import { db } from '../models/index.js'

export class AuthService {
    async login(user_email, password) {
        // 로그인 함수
        try {
            if (!user_email || !password) {
                throw new Error(
                    '이메일, 혹은 비밀번호가 모두 입력되지 않았습니다.'
                )
            }

            const hashedPw = getHash(password)

            const user = await db.User.findOne({
                // 입력한 이메일에 맞는 유저 찾기
                where: { user_email },
            })

            // 유저가 존재하지 않거나 비밀번호가 올바르지 않은 경우 err
            if (user === null || !(user.user_pw === hashedPw)) {
                throw new Error('유저가 존재하지 않거나 비밀번호가 틀림')
            }

            const auth = new jwtAuth()

            // 로그인 정보가 올바른 경우 access TK, refresh TK 발급
            const accessToken = auth.newToken(user.user_id)
            const refreshToken = auth.refreshToken()

            return { accessToken, refreshToken }
        } catch (err) {
            console.log(err)
            throw new Error('로그인 함수 실패')
        }
    }

    async signUp(newUserDto) {
        try {
            const hashedPw = getHash(newUserDto.password)

            const newUser = await db.User.create({
                // 시퀄라이즈 create를 통해 새로운 유저의 정보 DB에 저장
                user_email: newUserDto.email,
                user_pw: hashedPw,
                user_name: newUserDto.name,
                user_nickname: newUserDto.email,
            })

            console.log(newUser)
            return newUser
        } catch (err) {
            console.error(err)
            throw new Error('DB에 정보 저장 실패')
        }
    }
}
