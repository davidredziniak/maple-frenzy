const tradesController = require("../controllers").trades;
const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  app.get(
    "/api/trades/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.findById
  );
  app.post(
    "/api/trades/create",
    [authorizeJwt.verifyToken],
    tradesController.create
  );
};
