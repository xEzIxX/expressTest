import './config/env.js'

import express from 'express'
import morgan from 'morgan'

import { authRouter } from './routers/auth.js'
import { boardRouter } from './routers/board.js'

import { sequelizeLoader } from './loaders/sequelize.js'
import { tokenChecker } from './utils/tokenChecker.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(morgan('dev'))

app.route('/board/form').get(tokenChecker()).post(tokenChecker()) // 게시글 작성 폼 조회get, 저장 post(req.userId도 저장)
app.route('/board/:boardId/edit').get(tokenChecker()) // 수정 페이지 조회get (조회해야만 저장 가능)
app.route('/board/:boardId').delete(tokenChecker()) // 게시글 삭제

app.use('/auth', authRouter)
app.use('/board', boardRouter)

app.set('view engine', 'ejs')

await sequelizeLoader()

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: '서버 오류' })
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('server is running~')
})
