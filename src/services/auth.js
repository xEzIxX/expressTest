import { getHash } from 'src/utils/crypto.js'

export class AuthService {
    async login() {
        try {
            /* 로그인
            1. 비밀번호 암호화
            2. 입력된 아이디-> 암호화된 비밀번호를 데베에서 찾음, null이면 없는 아이디!(시퀄라이즈)
            3. 세션 저장, 결과값 리턴
            */

            const { user_email, password } = receiveUser

            const hashedPw = getHash(password)

            const userLogin = await userObj.findOne({
                where: { user_email },
            })

            // 만약 user_email이 존재하고 그 유저의 pw도 입력한 비밀번호와 일치하다면 true
            const isValid = userLogin && hashedPw === userLogin.user_pw

            return isValid
        } catch (err) {
            console.log('로그인 함수 실행 중 오류 발생', err)
        }
    }

    async signUp() {
        try {
            /* 회원 가입
            1. 비밀번호 암호화
            2. 유저 생성(시퀄라이즈 create)
            */

            // user의 회원 정보를 받는다
            const {
                user_id,
                user_follow,
                user_nickname,
                user_email,
                password,
            } = receiveUser

            const hashedPw = getHash(password)

            const newUser = await User.create({
                user_id,
                user_pw: hashedPw,
                user_follow,
                user_nickname,
                user_email,
            })

            return newUser || false
        } catch (err) {
            console.log('회원가입 함수 실행 중 발생', err)
        }
    }
}
