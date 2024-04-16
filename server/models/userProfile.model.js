module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: { model: "users", key: "id" },
      },
      tradeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "trade_count",
      },
      reputation: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "reputation",
      },
    },
    { tableName: "user_profiles", timestamps: false }
  );

  return UserProfile;
};
