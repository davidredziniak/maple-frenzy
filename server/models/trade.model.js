module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define(
    "Trade",
    {
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "seller_id",
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
      buyerLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "buyer_lim"
      },
      buyerAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "buyer_avail"
      }
    },
    { tableName: "trade", timestamps: false }
  );

  return Trade;
};
