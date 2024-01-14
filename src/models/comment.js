import { Sequelize, DataTypes } from 'sequelize'
import {sequelize} from './index.js'

//import { User } from './user.js'
//import { Board } from './board.js'

export function Comment(DataTypes, sequelize) {
    return Sequelize.define(
        'Comment',
        {
            comment_id: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
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
                // FK임
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
            comment_board_id: {
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
