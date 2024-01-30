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
            const { email, password } = req.body // 사용자는 user_email, pw를 통해 로그인

            const { accessToken } = await authService.login(  // tk 발급
                email,
                password
            )

            // Response > Header > Authoriczation 필드에 검증된 토큰을 담아보내기
            res.setHeader('Authorization', `Bearer ${accessToken}`)

            return res.status(201).json({
                message: '로그인 성공',
            })
        } catch (err) {
            throw err
        }
    })
)

authRouter.post(
    // 회원가입, 유저 정보 데이터 베이스에 저장
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
        body('name').notEmpty(),
        body('nickname').notEmpty(),
    ]),

    wrapper(async (req, res) => {
        try {
            const newUserDto = {
                // 사용자에게 정보를 입력 받은 정보를 담은 newUserDto 객체 생성
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                nickname: req.body.nickname,
            }

            const isCreated = await authService.signUp(newUserDto) // 데이터 베이스에 유저 객체 생성

            if (isCreated.result === false) {
                res.status(404).send(isCreated)
            } else {
                res.status(200).send(isCreated) // 유저 객체 생성 완료(회원가입 성공)
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
            const Token = req.headers.authorization
            let isToken

            Token === null ? (isToken = false) : (isToken = true)

            if (isToken) {
                res.setHeader('Authorization', '')
                //console.log('로그아웃 성공, 로그인 페이지로 이동합니다.')
                res.redirect('../login')
            }
        } catch (err) {
            throw err
        }
    })
)

export { authRouter }
