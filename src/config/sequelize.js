import 'dotenv/config'
const env = process.env;

const development = {
  database: env.DB_NAME || 'database',
  username: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'password',
  options : {
    host: env.DB_HOST || 'localhost',
    dialect: env.DB_DIALECT,
    }
}

const production = {
  database: env.DB_NAME || 'database',
  username: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'password',
  options : {
    host: env.DB_HOST || 'localhost',
    dialect: env.DB_DIALECT,
    }
}

export {development, production}