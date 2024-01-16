export function Comment(sequelize, DataTypes) {
    return sequelize.define(
        'Comment',
        {
            comment_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            comment_content: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            comment_liked: {
                type: DataTypes.INTEGER,
            },
            comment_user_id: {
                type: DataTypes.UUID,
                field: 'comment_writer',
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            comment_board_id: {
                type: DataTypes.UUID,
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
