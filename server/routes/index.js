const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const tradeRoutes = require("../routes/trade.routes");

module.exports = (app) => {
  authRoutes(app);
  userRoutes(app);
  tradeRoutes(app);
};
