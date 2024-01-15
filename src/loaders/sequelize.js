import { sequelize } from '../models/Instance.js'

const sequelizeLoader = async function () {
    try{
        await sequelize.authenticate()
        console.log('데이터 베이스 연결 성공')

        await sequelize.sync({ force: false })
        console.log('데이터 베이스 동기화 성공')

    } catch (error) {
        console.error('데이터 베이스 연결 실패:', error)
    }
}

export { sequelizeLoader }
