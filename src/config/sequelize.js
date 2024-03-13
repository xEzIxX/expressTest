import './env.js'

const config = {
    database: process.env.DB_NAME || 'database',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    options: {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT,
        timezone: '+09:00',
    },
}

export { config }
