import dotenv from 'dotenv'

export function envSet() {
    if (process.env.NODE_ENV === 'production') {
        dotenv.config({ path: '.env.prod' })
    } else if (process.env.NODE_ENV === 'development') {
        dotenv.config({ path: '.env.dev' })
    } else {
        throw new Error('process.env.NODE_ENV이 설정되지 않았습니다.')
    }
}
