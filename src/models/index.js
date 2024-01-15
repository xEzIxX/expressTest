import 'dotenv/config'
import { Sequelize } from 'sequelize'

import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'

const db = {}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
)

db.sequelize = sequelize

db.User = User(sequelize)
db.Board = Board(sequelize)
db.Comment = Comment(sequelize)

db.User.hasMany(db.Comment, {
    foreignKey: 'comment_user_id',
})

db.Comment.belongsTo(db.User, {
    foreignKey: 'comment_user_id',
})

db.Board.hasMany(db.Comment, {
    foreignKey: 'comment_board_id',
})

db.Comment.belongsTo(db.Board, {
    foreignKey: 'comment_board_id',
})

db.User.hasMany(db.Board, {
    foreignKey: 'board_user_id',
})

db.Board.belongsTo(db.User, {
    foreignKey: 'board_user_id',
})

export { db }