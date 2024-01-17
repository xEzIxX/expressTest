import { envSet } from './utils/envset.js'
import express from 'express'
import morgan from 'morgan'
import { authRouter } from './routers/auth.js'
import { sequelizeLoader } from './loaders/sequelize.js'

const app = express()
envSet()

app.use(morgan('dev'))

app.use('/auth', authRouter)

await sequelizeLoader()

app.use((err, req, res, next) => {
    res.status(404).send('Not Found')
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('server is running~')
})
