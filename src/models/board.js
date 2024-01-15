import { DataTypes } from 'sequelize'
import { sequelize } from './Instance.js'

export function Board(sequelize, DataTypes) {
    return sequelize.define(
        'Board',
        {
            board_id: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
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
            },
            board_user_id: {
                // FK임
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    )
}
