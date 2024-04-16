module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: "username",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      lastLoggedIn: {
        type: DataTypes.DATE,
        field: "last_logged_in",
      },
      isSubscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "is_subscribed"
      },
    },
    { tableName: "users", timestamps: false }
  );

  return User;
};
