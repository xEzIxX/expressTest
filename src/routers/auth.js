import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { AuthService } from '../services/auth.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

export const authRouter = express.Router()
const authService = new AuthService()

// 로그인
authRouter.get('/login', (req, res) => {
    return res.render('auth/login.ejs')
})

authRouter.post(
    '/login',
    validate([body('email').notEmpty().isEmail(), body('password').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const userDto = {
                email: req.body.email,
                password: req.body.password,
            }

            const foundUser = await authService.login(userDto) // tk 발급

            if (foundUser.result === true) {
                const accessToken = foundUser.token
                res.setHeader('Authorization', `Bearer ${accessToken}`) // 로그인 시 access 토큰 발급

                return res.status(200).send(foundUser)
                // header에는 Bearer가 토큰 앞에 존재하지만, foundUser.token에는 토큰만 존재
            } else if (foundUser.result === false) {
                return res.status(401).send(foundUser) // 잘못된 로그인 정보 입력
            } else {
                return res.status(500).send({ message: '서버 오류' })
            }
        } catch (err) {
            throw err
        }
    })
)

// 회원가입
authRouter.get('/sign', (req, res) => {
    try {
        return res.render('auth/sign.ejs')
    } catch (err) {
        throw err
    }
})

authRouter.post(
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
                return res.status(201).send(newUser) // 유저 객체 생성 완료 (회원가입 성공)
            } else if (newUser.result === false) {
                return res.status(404).send(newUser)
            } else {
                return res.status(500).send({ message: '서버 오류' })
            }
        } catch (err) {
            throw err
        }
    })
)

// 로그아웃
authRouter.get(
    '/logout',
    wrapper(async (req, res) => {
        try {
            const isToken = Boolean(req.headers.authorization)

            if (isToken === true) {
                res.setHeader('Authorization', '')
                return res.status(200).send({ message: '로그아웃 성공' })
            } else {
                return res.status(401).send({ message: '로그인 상태가 아님' })
            }
        } catch (err) {
            throw err
        }
    })
)
