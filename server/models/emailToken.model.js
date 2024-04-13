module.exports = (sequelize, DataTypes) => {
  const EmailToken = sequelize.define(
    "EmailToken",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: { model: "users", key: "id" },
      },
      token: {
        type: DataTypes.STRING,
        field: "token",
      },
    },
    { tableName: "email_tokens", timestamps: false }
  );

  return EmailToken;
};
