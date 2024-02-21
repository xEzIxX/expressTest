import './config/env.js'

import express from 'express'
import morgan from 'morgan'
import { authRouter } from './routers/auth.js'
import { sequelizeLoader } from './loaders/sequelize.js'
const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(morgan('dev'))

app.use('/auth', authRouter)

app.set('view engine', 'ejs')

await sequelizeLoader()

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: '서버 오류' })
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('server is running~')
})