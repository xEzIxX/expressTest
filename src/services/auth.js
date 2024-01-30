import { getHash } from '../utils/crypto.js'
import { jwtAuth } from '../utils/jwt.js'
import { db } from '../models/index.js'

export class AuthService {
    async login(user_email, password) {
        // 로그인 함수
        try {
            const hashedPw = getHash(password)

            const user = await db.User.findOne({
                // 입력한 이메일, 비밀번호에 맞는 유저 찾기
                where: { user_email, user_pw: hashedPw },
            })

            if (user === null) {
                throw err
            } else {
                // 로그인 정보가 올바른 경우 access TK발급
                const auth = new jwtAuth()
                const accessToken = auth.newToken(user.user_id, user.user_nickname)
                auth.verifyToken(accessToken) // 유효하면 복호화된 payload반환, 아니라면 throw err

                return { accessToken }
            }
        } catch (err) {
            throw err
        }
    }

    async signUp(newUserDto) {
        try {
            const hashedPw = getHash(newUserDto.password)

            const existEmail = await db.User.findOne({
                where: { user_email: newUserDto.email },
            })
            // console.log(existEmail)
            const existNickname = await db.User.findOne({
                where: { user_nickname: newUserDto.nickname },
            })
            // console.log(existNickname)

            if (existEmail === null && existNickname === null) {
                await db.User.create({
                    // 시퀄라이즈 create를 통해 새로운 유저의 정보 DB에 저장
                    user_email: newUserDto.email,
                    user_pw: hashedPw,
                    user_name: newUserDto.name,
                    user_nickname: newUserDto.nickname,
                })

                return { result: true, message: '회원가입' }
            } else if (existEmail === null && existNickname !== null) {
                return { result: false, message: '중복된 닉네임' }
            } else if (existEmail !== null && existNickname === null) {
                return { result: false, message: '중복된 이메일' }
            } else {
                return { result: false, message: '중복된 닉네임과 이메일' }
            }
        } catch (err) {
            throw err
        }
    }
}
