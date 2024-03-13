const tradesController = require("../controllers").trades;
const tradeSlotController = require("../controllers").tradeSlots;

const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  app.post(
    "/api/trades/create",
    [authorizeJwt.verifyToken],
    tradesController.create
  );
  app.post(
    "/api/trades/join",
    [authorizeJwt.verifyToken],
    tradesController.join,
    tradeSlotController.addUserToQueue
  );
  app.get(
    "/api/trades/data/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.findById
  );
};
