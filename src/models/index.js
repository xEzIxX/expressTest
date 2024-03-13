import { config } from '../config/sequelize.js'
import { Sequelize, DataTypes } from 'sequelize'

import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'

import { Board_like } from './boardLike.js'
import { Comment_like } from './commentLike.js'

import { User_follow } from './userLollow.js'

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

db.Board_like = Board_like(sequelize, DataTypes)
db.Comment_like = Comment_like(sequelize, DataTypes)

db.User_follow = User_follow(sequelize, DataTypes)

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

// 게시글 좋아요 Board_like 테이블의 관계
db.User.hasMany(db.Board_like, {
    foreignKey: 'board_like_user_id',
})
db.Board_like.belongsTo(db.User, {
    foreignKey: 'board_like_user_id',
})

db.Board.hasMany(db.Board_like, {
    foreignKey: 'board_like_board_id',
})
db.Board_like.belongsTo(db.Board, {
    foreignKey: 'board_like_board_id',
})

// 댓글 좋아요 Comment_like 테이블의 관계
db.Comment.hasMany(db.Comment_like, {
    foreignKey: 'comment_like_comment_id',
})
db.Comment_like.belongsTo(db.Comment, {
    foreignKey: 'comment_like_comment_id',
})

db.User.hasMany(db.Comment_like, {
    foreignKey: 'comment_like_user_id',
})
db.Comment_like.belongsTo(db.User, {
    foreignKey: 'comment_like_user_id',
})

// 유저 팔로우 User_follow 테이블의 관계
db.User.hasMany(db.User_follow, {
    foreignKey: 'user_follow_follower_id',
})
db.User_follow.belongsTo(db.User, {
    foreignKey: 'user_follow_follower_id',
})

export { db }
