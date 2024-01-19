import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
    path = '.env.dev';
} else if (process.env.NODE_ENV === 'production') {
    path = '.env.prod';
} else {
    console.log('환경 설정이 되지 않았습니다.')
}

dotenv.config({ path })
