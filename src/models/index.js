import { config } from '../config/sequelize.js'
import { Sequelize, DataTypes } from 'sequelize'

import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'

import { Board_like } from './board_like.js'
import { Comment_like } from './comment_like.js'

import { User_follow } from './user_follow.js'

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
db.Comment.belongsTo(db.User)

db.Board.hasMany(db.Comment, {
    foreignKey: 'comment_board_id',
})
db.Comment.belongsTo(db.Board)

db.User.hasMany(db.Board, {
    foreignKey: 'board_user_id',
})
db.Board.belongsTo(db.User)

db.User.hasMany(db.Board_like, {
    foreignKey: 'board_like_user',
})
db.Board_like.belongsTo(db.User)

// 게시글 좋아요 Board_like 테이블의 관계
db.Board.hasMany(db.Board_like, {
    // 게시글 테이블은 게시글 좋아요 테이블과 1:N 관계
    as: 'board_like',
    foreignKey: 'board_like_board_id',
})
db.Board_like.belongsTo(db.Board)

db.User.hasMany(db.Board_like, {
    // 유저 테이블은 게시글 좋아요 테이블과 1:N 관계
    as: 'user_like_board',
    foreignKey: 'board_like_user_id',
})
db.Board_like.belongsTo(db.User)

// 댓글 좋아요 Comment_like 테이블의 관계
db.Comment.hasMany(db.Comment_like, {
    // 댓글 테이블은 댓글 좋아요 테이블과 1:N 관계
    as: 'comment_like',
    foreignKey: 'comment_like_comment_id',
})
db.Comment_like.belongsTo(db.Comment)

db.User.hasMany(db.Comment_like, {
    // 유저 테이블은 댓글 좋아요 테이블과 1:N 관계
    as: 'user_like_comment',
    foreignKey: 'comment_like_user_id',
})
db.Comment_like.belongsTo(db.User)

// 유저 팔로우 User_follow 테이블의 관계
db.User.hasMany(db.User_follow, {
    // 댓글 테이블은 댓글 좋아요 테이블과 1:N 관계
    as: 'user_follower',
    foreignKey: 'user_follow_follower_id',
})
db.User_follow.belongsTo(db.User)

export { db }
