import express from 'express';

const router = express.Router()

//Get /user 라우터
router.get('/',(req,res)=>{
    res.send('유저 방가방가');
});

export default router;