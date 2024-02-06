import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { AuthService } from '../services/auth.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

const authRouter = express.Router()
const authService = new AuthService()

authRouter.post(
    // 로그인 페이지
    '/login',
    validate([body('email').notEmpty().isEmail(), body('password').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const userDto = {
                email: req.body.email,
                password: req.body.password,
            }

            const { accessToken } = await authService.login(userDto) // tk 발급

            // Response > Header > Authoriczation 필드에 검증된 토큰을 담아보내기
            res.setHeader('Authorization', `Bearer ${accessToken}`)

            return res.status(200).json({
                message: '로그인 성공',
            })
        } catch (err) {
            throw err
        }
    })
)

authRouter.post(
    // 회원가입
    '/sign',

    validate([
        body('email').notEmpty().isEmail(),
        body(
            'password',
            '비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 적어도 하나씩 포함해야합니다.'
        ).isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
        body('checkPw').isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
        body('name').notEmpty().isString(),
        body('nickname').notEmpty().isString(),
    ]),

    wrapper(async (req, res) => {
        try {
            const newUserDto = {
                // 사용자에게 정보를 입력 받은 정보를 담은 newUserDto 객체 생성
                email: req.body.email,
                password: req.body.password,
                checkPw: req.body.checkPw,
                name: req.body.name,
                nickname: req.body.nickname,
            }

            const newUser = await authService.signUp(newUserDto) // 데이터 베이스에 유저 객체 생성

            if (newUser.result === true) {
                res.status(201).send(newUser) // 유저 객체 생성 완료(회원가입 성공)
            } else {
                res.status(404).send(newUser)
            }
        } catch (err) {
            throw err
        }
    })
)

authRouter.get(
    '/logout',
    // 로그아웃
    wrapper(async (req, res) => {
        try {
            const token = req.headers.authorization

            const isToken = !(
                token === null ||
                token === undefined ||
                token === ''
            )

            if (isToken) {
                res.setHeader('Authorization', '')
                console.log('로그아웃 성공, 로그인 페이지로 이동합니다.')
                return res.redirect('../auth/login')
            } else {
                return res.send('로그인 상태가 아닙니다.')
            }
        } catch (err) {
            throw err
        }
    })
)

export { authRouter }
