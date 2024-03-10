export function User_follow(sequelize, DataTypes) {
    return sequelize.define(
        'User_follow',
        {
            user_follow_id: {
                // 유저 팔로우 테이블의 id
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_follow_follower_id: {
                // 참조할 유저 테이블의 (팔로잉 하는) 유저 id
                type: DataTypes.UUID,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            user_follow_followed_id: {
                // 팔로우할 유저 id
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
        }
    )
}
