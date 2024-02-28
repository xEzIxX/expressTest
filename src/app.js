import './config/env.js'

import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { authRouter } from './routers/auth.js'
import { boardRouter } from './routers/board.js'

import { sequelizeLoader } from './loaders/sequelize.js'
import { tokenChecker } from './utils/tokenChecker.js'

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.set('views', './src/views')

await sequelizeLoader()

// 토큰 유무를 판단하는 미들웨어
app.route('/board/form').get(tokenChecker()).post(tokenChecker()) // 게시글 작성 폼 조회get, 저장 post(req.userId도 저장)
app.route('/board/:boardId/edit').get(tokenChecker()) // 수정 페이지 조회get (조회해야만 저장 가능)
app.route('/board/:boardId').delete(tokenChecker()) // 게시글 삭제

// 라우터
app.use('/auth', authRouter)
app.use('/board', boardRouter)

// 에러 핸들러
app.use((err, req, res, next) => {
    console.log('에러 핸들러에서 처리된 서버 오류', err)
    res.status(500).send({ message: '서버 오류' })
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('server is running~')
})
