import express from 'express'
import { AuthService } from '../services/auth.js'

const authRouter = express.Router()
const authService = new AuthService()

authRouter.post('/', function (req, res) {
    // 로그인 페이지
    try {
        const { user_email, password } = req.body // 사용자는 user_email, pw를 통해 로그인

        const accessTK = authService.login(user_email, password) // 로그인 성공 시 tk 발급, 실패시 false

        // Response > Header > Authorization 필드 에 토큰을 담아보내기
        res.setHeader('Authorization', `Bearer ${accessTK}`)

        return res.status(201).json({
            code: 201,
            message: '로그인 성공',
        })
    } catch (err) {
        return res.status(401).json({ error: '로그인 실패' })
    }
})

authRouter.post('/sign', async function (req, res) {
    try {
        const newUserDto = {
            // 사용자에게 정보를 입력 받음
            user: req.body.user,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            nickName: req.body.nickname,
        }
        const createdUser = await authService.signUp(newUserDto) // 데이터 베이스에 유저 객체 생성

        res.send(createdUser)
    } catch (err) {
        return res.status(500).json({ error: '회원가입 실패' })
    }
})

authRouter.get('/refresh', function (req, res) {
    // 토큰 만료 혹은 새로고침할 시 이 경로로 redirect
    /* 1. accessTK 만료, refresh토큰 만료 -> 다시 로그인
       2. access TK 만료, refresh토큰 만료X -> refresh토큰으로 다시 accessTK 재발급
       3. access TK 만료 X -> 접근 허용 */
})

export { authRouter }
