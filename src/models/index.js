import { Sequelize, DataTypes } from 'sequelize'
import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'
import { development, production } from '../../config/sequelize.js'
const config = process.env.NODE_ENV === 'development' ? development : production

const db = {}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
)

db.sequelize = sequelize

db.User = User(sequelize, DataTypes)
db.Board = Board(sequelize, DataTypes)
db.Comment = Comment(sequelize, DataTypes)

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
