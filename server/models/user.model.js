module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
      field: 'last_logged_in'
    }
  }, { timestamps: false });

  return User;
};
