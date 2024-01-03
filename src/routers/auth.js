import express from 'express'
const authRouter = express.Router()

authRouter.route('/')
    .get(login)
    .post(checkLog)

authRouter.get('/logout', main)

authRouter.route('/sign')
    .get(signUp)
    .post(signUpHandler)

export {authRouter}