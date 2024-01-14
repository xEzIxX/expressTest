import { Sequelize, DataTypes } from 'sequelize'

const User = Sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            // type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4
        },
        user_pw: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        user_follow: {
            type: DataTypes.STRING(50),
        },
        user_nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
)

export { User }