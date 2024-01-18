import dotenv from 'dotenv'

export function config() {
    let config

    if (process.env.NODE_ENV === 'production') {
        dotenv.config({ path: '.env.prod' })

        config = {
            database: process.env.DB_NAME || 'database',
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            options: {
                host: process.env.DB_HOST || 'localhost',
                dialect: process.env.DB_DIALECT,
            },
        }
    } else if (process.env.NODE_ENV === 'development') {
        dotenv.config({ path: '.env.dev' })

        config = {
            database: process.env.DB_NAME || 'database',
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            options: {
                host: process.env.DB_HOST || 'localhost',
                dialect: process.env.DB_DIALECT,
            },
        }
    } else {
        console.log('환경 세팅 실패')
    }
    return config
}
