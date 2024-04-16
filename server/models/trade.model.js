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
        field: "price",
      },
      channels: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        field: "channels",
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
        field: "buyer_lim",
      },
      buyerAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "buyer_avail"
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "in_progress"
      },
    },
    { tableName: "trades", timestamps: false }
  );

  return Trade;
};
