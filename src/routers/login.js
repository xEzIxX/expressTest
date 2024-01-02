import express from "express";
const router = express.Router();

router.route('/')
    .get(login)
    .post(checkLog);

router.route('/logout')
    .get(logout);

router.route('/sign')
    .get(signUp)
    .post(signUpHandler);

export default router;