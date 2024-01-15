import { DataTypes } from 'sequelize'
import { sequelize } from './Instance.js'

export function Comment() {
    return sequelize.define(
        'Comment',
        {
            comment_id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                // type: DataTypes.UUID,
                // defaultValue: DataTypes.UUIDV4
            },
            comment_content: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            comment_liked: {
                type: DataTypes.INTEGER,
            },
            comment_user_id: {
                type: DataTypes.BIGINT(20),
                field: 'comment_writer',
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            comment_board_id: {
                type: DataTypes.BIGINT(20),
                field: 'board_commenter',
                references: {
                    model: 'Board',
                    key: 'board_id',
                },
            },
        },
        {
            freezeTableName: true,
        }
    )
}