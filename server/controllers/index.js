const auth = require("./auth.controller");
const users = require("./user.controller");
const trades = require("./trade.controller");
const tradeSlots = require("./tradeSlot.controller");

module.exports = {
  auth,
  users,
  trades,
  tradeSlots,
};
