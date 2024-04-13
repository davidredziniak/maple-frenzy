const dbConfig = require("../config/db.config.js");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.userProfiles = require("./userProfile.model.js")(sequelize, DataTypes);
db.trades = require("./trade.model.js")(sequelize, DataTypes);
db.tradeSlots = require("./tradeSlot.model.js")(sequelize, DataTypes);

// Link user_profiles "user_id" to "id" in `user` table
db.userProfiles.belongsTo(db.users, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

// Link trades made by a "seller_id" to "id" in `user` table
db.trades.belongsTo(db.users, {
  foreignKey: {
    name: "sellerId",
    allowNull: false,
  },
});

// Link trade slots "trade_id" to "id" in `trade` table
db.tradeSlots.belongsTo(db.trades, {
  foreignKey: {
    name: "tradeId",
    allowNull: false,
  },
});

// Link trade slots "user_id" to "id" in `user` table
db.tradeSlots.belongsTo(db.users, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

module.exports = db;
