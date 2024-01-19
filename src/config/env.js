import dotenv from 'dotenv'
const path = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'
dotenv.config({ path })
