import dotenv from 'dotenv'

let path

if (process.env.NODE_ENV === 'development') {
    path = '.dev.env'
} else if (process.env.NODE_ENV === 'production') {
    path = '.prod.env'
} else {
    console.log('환경 설정이 되지 않았습니다.')
}

dotenv.config({ path, debug: true })
