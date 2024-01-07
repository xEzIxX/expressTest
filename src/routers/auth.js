import express from 'express'
import { Auth } from '../services/auth.js'
const authRouter = express.Router()

authRouter.get('/', function (req, res) {
    try {
        Auth.login()
    } catch (err) {
        console.log(err)
    }
})

authRouter.post('/', function (req, res) {
    try {
        Auth.checkLog()
    } catch (err) {
        console.log(err)
    }
})

authRouter.get('/logout', function (req, res) {
    try {
        Auth.main()
    } catch (err) {
        console.log(err)
    }
})

authRouter.get('/sign', function (req, res) {
    try {
        Auth.signUp()
    } catch (err) {
        console.log(err)
    }
})

authRouter.post('/sign', function (req, res) {
    try {
        Auth.signUpHandler()
    } catch (err) {
        console.log(err)
    }
})

export { authRouter }