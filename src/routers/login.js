import express from 'express'
const router = express.Router()

router.route('/')
    .get(login)
    .post(checkLog)

router.route('/logout')
    .get(main)

router.route('/sign')
    .get(signUp)
    .post(signUpHandler)

export {router}