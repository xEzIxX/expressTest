export function User(sequelize, DataTypes) {
    return sequelize.define(
        'User',
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_pw: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            user_follow: {
                type: DataTypes.STRING(50),
            },
            user_nickname: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            user_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            user_email: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
        },
        {
            freezeTableName: true,
        }
    )
}
