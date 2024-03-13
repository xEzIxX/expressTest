export function Comment_like(sequelize, DataTypes) {
    return sequelize.define(
        'Comment_like',
        {
            comment_like_id: {
                // 댓글 좋아요 테이블의 id
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            comment_like_comment_id: {
                // 참조할 댓글 테이블의 id
                type: DataTypes.UUID,
                references: {
                    model: 'Comment',
                    key: 'comment_id',
                },
            },
            comment_like_user_id: {
                // 참조할 댓글을 좋아요한 유저의 id
                type: DataTypes.UUID,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
        },
        {
            freezeTableName: true,
        }
    )
}
