export function Board_like(sequelize, DataTypes) {
    return sequelize.define(
        'Board_like',
        {
            board_like_id: {
                // 게시글 좋아요 테이블의 id
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            board_like_board_id: {
                // 참조할 게시글 테이블의 id
                type: DataTypes.UUID,
                references: {
                    model: 'Board',
                    key: 'board_id',
                },
            },
            board_like_user_id: {
                // 참조할 게시글을 좋아요한 유저의 id
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
