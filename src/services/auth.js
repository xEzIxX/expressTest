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
                // findOne은 User 모델의 인스턴스 혹은 null을 반환,
                where: { user_email: userDto.email, user_pw: hashedPw },
            })

            if (user instanceof db.User) {
                const accessToken = newToken(user.user_id, user.user_nickname)
                jwt.verify(accessToken, process.env.SECRET_KEY) // 유효하지 않으면 throw err

                return {
                    result: true,
                    message: '존재하는 회원',
                    token: accessToken,
                }
            } else if (user === null) {
                return {
                    result: false,
                    message: '회원정보가 존재하지 않음',
                    token: null,
                }
            } else {
                throw err
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

            const foundEmail = await db.User.findOne({
                where: { user_email: newUserDto.email },
            })

            const foundNickname = await db.User.findOne({
                where: { user_nickname: newUserDto.nickname },
            })

            if (foundEmail === null && foundNickname === null) {
                await db.User.create({
                    // 시퀄라이즈 create를 통해 새로운 유저의 정보 DB에 저장
                    user_email: newUserDto.email,
                    user_pw: hashedPw,
                    user_name: newUserDto.name,
                    user_nickname: newUserDto.nickname,
                })

                const foundCreated = await db.User.findOne({
                    where: {
                        user_email: newUserDto.email,
                        user_pw: hashedPw,
                        user_name: newUserDto.name,
                        user_nickname: newUserDto.nickname,
                    },
                })

                if (foundCreated instanceof db.User) {
                    return { result: true, message: '회원가입' }
                } else if (foundCreated === null) {
                    return {
                        result: false,
                        message: '회원가입 중 회원정보 저장 실패',
                    }
                } else {
                    throw err
                }
            } else {
                let falseMessage

                if (foundEmail === null && foundNickname !== null) {
                    falseMessage = '중복된 닉네임'
                } else if (foundEmail !== null && foundNickname === null) {
                    falseMessage = '중복된 이메일'
                } else falseMessage = '중복된 닉네임과 이메일'

                return { result: false, message: falseMessage }
            }
        } catch (err) {
            throw err
        }
    }
}
