import express from 'express'
const loginRouter = express.Router()

loginRouter.route('/')
    .get(login)
    .post(checkLog)

loginRouter.route('/logout')
    .get(main)

loginRouter.route('/sign')
    .get(signUp)
    .post(signUpHandler)

export {loginRouter}