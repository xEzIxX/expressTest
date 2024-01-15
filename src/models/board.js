import { DataTypes } from 'sequelize'
import { sequelize } from './Instance.js'

export function Board() {
    return sequelize.define(
        'Board',
        {
            board_id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                // type: DataTypes.UUID,
                // defaultValue: DataTypes.UUIDV4
            },
            board_title: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            board_content: {
                type: DataTypes.STRING(255),
            },
            board_view: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            board_liked: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            board_user_id: {
                type: DataTypes.BIGINT(20),
                field: 'board_writer',
                references: {
                    model: 'User', // User 모델을 참조하는 코드 Fk를 나타냄
                    key: 'user_id', // 참조된 모델의 컬럼 이름
                },
            },
        },
        {
            freezeTableName: true,
        }
    )
}