import { Sequelize } from 'sequelize'

const sequelizeLoader = async function () {
    try {
        const sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT,
            }
        )

        await sequelize.authenticate()
        console.log('데이터 베이스 연결 성공')

        await sequelize.sync({ force: false })
        console.log('데이터 베이스 동기화 성공')
    } catch (error) {
        console.error('데이터 베이스 연결 실패:', error)
    }
}

export { sequelizeLoader }
