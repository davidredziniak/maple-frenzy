const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");

module.exports = (app) => {
  authRoutes(app);
  userRoutes(app);
};
