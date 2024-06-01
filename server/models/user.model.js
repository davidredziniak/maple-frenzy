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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: "email",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_verified",
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
        defaultValue: false,
        field: "is_subscribed"
      },
    },
    { tableName: "users", timestamps: false }
  );

  return User;
};
