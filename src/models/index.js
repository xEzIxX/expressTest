import { Sequelize, Datatypes } from 'sequelize'
import { sequelize } from './Instance.js'

import { User } from './user.js'
import { Board } from './board.js'
import { Comment } from './comment.js'

try{
const db = {} //실제 db가 이 객체와 연결

db.sequelize = sequelize
db.Sequelize = Sequelize

db.User = User(sequelize, DataTypes)
db.Comment = Comment(sequelize, DataTypes)
db.Board = Board(sequelize, DataTypes)

/*
db.User.init(sequelize) // 모델과 테이블의 종합적인 연결
db.Comment.init(sequelize)
db.Board.init(sequelize) 
*/

db.User.hasMany(db.Comment, {
    foreignKey: 'comment_user_id',
})

db.User.hasMany(db.Board, {
    foreignKey: 'comment_board_id',
})

db.Board.hasMany(db.Comment, {
    foreignKey: 'comment_board_id',
})

db.Board.belongsTo(db.User, {
    foreignKey: 'comment_board_id',
})
db.Comment.belongsTo(db.Board, {
    foreignKey: 'comment_board_id',
})
db.Comment.belongsTo(db.User, {
    foreignKey: 'comment_user_id',
})
}catch(err){
    console.log('데이터 베이스 정의 실패', err)
}

export { db }