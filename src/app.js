import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

import authRouter from './routers/auth.js'

const app = express()

app.use(morgan('dev'))

app.use('/auth', authRouter)

app.use((err, req, res, next) => {
    res.status(404).send('Not Found')
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('server is running~')
})
