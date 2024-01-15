import { Sequelize } from 'sequelize'
import { sequelize } from './Instance.js'

import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'

const db = {} // 실제 db가 이 객체와 연결됨

db.sequelize = sequelize
db.Sequelize = Sequelize

db.User = User()
db.Board = Board()
db.Comment = Comment()

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