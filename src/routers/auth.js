import express from 'express'
const loginRouter = express.Router()

loginRouter.route('/')
    .get(login)
    .post(checkLog)

loginRouter.get('/logout', main)

loginRouter.route('/sign')
    .get(signUp)
    .post(signUpHandler)

export {loginRouter}