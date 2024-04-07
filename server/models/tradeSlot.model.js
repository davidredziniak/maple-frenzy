module.exports = (sequelize, DataTypes) => {
  const TradeSlot = sequelize.define(
    "TradeSlot",
    {
      tradeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "trade_id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      channel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "channel",
      },
      queuePos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "pos",
      },
    },
    { tableName: "trade_slots", timestamps: false }
  );

  return TradeSlot;
};
