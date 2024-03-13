module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define(
    "Trade",
    {
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      timeStart: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "time_start",
      },
      timeEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "time_end",
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "price"
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "region"
      },
      buyerLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "buyer_lim"
      }
    },
    { tableName: "trade", timestamps: false }
  );

  return Trade;
};
