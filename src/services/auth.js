import '../config/env.js'
import jwt from 'jsonwebtoken'
import { newToken } from '../utils/newToken.js'
import { getHash } from '../utils/getHash.js'
import { db } from '../models/index.js'

export class AuthService {
    async login(userDto) {
        // 로그인 함수
        try {
            const hashedPw = getHash(userDto.password)

            const user = await db.User.findOne({
                // 입력한 이메일, 비밀번호에 맞는 유저 찾기
                where: { user_email: userDto.email, user_pw: hashedPw },
            })

            if (user === null) { // 존재하지 않음
                throw err
            } else if (user === undefined) { // 비정상적인 case
                throw err
            } else {
                // 로그인 정보가 올바른 경우 access TK발급
                const accessToken = newToken(
                    user.user_id,
                    user.user_nickname
                )
                jwt.verify(accessToken, process.env.SECRET_AK_KEY) // 유효하지 않으면 throw err

                return { accessToken }
            }
        } catch (err) {
            throw err
        }
    }

    async signUp(newUserDto) {
        try {
            if (newUserDto.password !== newUserDto.checkPw) {
                return {
                    result: false,
                    message:
                        '비밀번호 확인 칸에는 동일한 비밀번호를 입력해주세요.',
                }
            }
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
            } else {
                let falseMessage

                if (existEmail === null && existNickname !== null) {
                    falseMessage = '중복된 닉네임'
                } else if (existEmail !== null && existNickname === null) {
                    falseMessage = '중복된 이메일'
                } else falseMessage = '중복된 닉네임과 이메일'

                return { result: false, message: falseMessage }
            }
        } catch (err) {
            throw err
        }
    }
}
