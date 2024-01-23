import { getHash } from 'src/utils/crypto.js'
import { jwtAuth } from 'src/utils/jwt.js'

export class AuthService {
    async login(user_email, password) {
        // 로그인 함수
        try {
            if (user_email === null || password === null) return false // 입력된 정보가 없음

            const hashedPw = getHash(password)

            const user = await userObj.findOne({
                // 입력한 이메일에 맞는 유저 찾기
                where: { user_email },
            })

            // 유저가 존재하지 않거나 비밀번호가 올바르지 않은 경우 false
            if (user === null || !(user.user_pw === hashedPw)) return false

            // 로그인 정보가 올바른 경우 access TK, refresh TK 발급
            const accessToken = jwtAuth.newToken(user.user_id)
            const refreshToken = jwtAuth.refreshToken()

            // 시퀄라이즈 - refresh TK를 user 객체(DB)에 저장 (accessTK 유효기간이 끝나면 재발급 받는데 사용됨)
            try {
                await user.update(
                    { freshTK: refreshToken },
                    {
                        where: {
                            user_email: user.user_email,
                        },
                    }
                )
            } catch (err) {
                false
            }
            // 생성된 accessTK 클라이언트에게 반환

            return accessToken
        } catch (err) {
            return false
        }
    }

    async signUp(newUserDto) {
        try {
            const hashedPw = getHash(newUserDto.password)

            const newUser = await User.create({
                // 시퀄라이즈 create를 통해 새로운 유저의 정보 DB에 저장
                user_user: newUserDto.user,
                user_email: newUserDto.email,
                user_pw: hashedPw,
                user_name: newUserDto.name,
                user_nickname: newUserDto.email,
            })

            return newUser
        } catch (err) {
            console.log('회원가입 함수 실행 중 발생', err)
        }
    }
}
