module.exports = (sequelize, DataTypes) => {
  const FinishedTrade = sequelize.define(
    "FinishedTrade",
    {
      tradeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "trade_id",
      },
      tradeData: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: "trade_data",
      },
      tradeSlotData: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: "trade_slot_data",
      },
    },
    { tableName: "finished_trades", timestamps: false }
  );

  return FinishedTrade;
};
