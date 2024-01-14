import { Sequelize } from 'sequelize'
import 'dotenv/config'
import { User } from './user'

const db = {}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD
)
db.sequelize = sequelize

db.User = User // 모델 클래스를 넣음
User.init(sequelize) // 모델과 테이블의 종합적인 연결
//User.associate(db) // db객체 안의 모델들 간의 관계 설정

export { db }