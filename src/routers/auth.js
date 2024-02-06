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

            const foundUser = await authService.login(userDto) // tk 발급

            if (foundUser.result === true){
                const accessToken = foundUser.accessToken
                res.setHeader('Authorization', `Bearer ${accessToken}`)

                return res.send(foundUser.message)
            }else{
                return res.send(foundUser.message)
            }

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
                return res.status(201).send(newUser.message) // 유저 객체 생성 완료(회원가입 성공)
            } else {
                return res.status(404).send(newUser.message)
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
