import express from 'express'
import { Auth } from '../services/auth.js'

const authRouter = express.Router()
const authService = new Auth()

authRouter.get('/', function (req, res) {
    try {
        authService.login()
    } catch (err) {
        console.log(err)
    }
})

authRouter.post('/', function (req, res) {
    try {
        authService.checkLog()
    } catch (err) {
        console.log(err)
    }
})

authRouter.get('/logout', function (req, res) {
    try {
        authService.main()
    } catch (err) {
        console.log(err)
    }
})

authRouter.get('/sign', function (req, res) {
    try {
        authService.signUp()
    } catch (err) {
        console.log(err)
    }
})

authRouter.post('/sign', function (req, res) {
    try {
        authService.signUpHandler()
    } catch (err) {
        console.log(err)
    }
})

export { authRouter }