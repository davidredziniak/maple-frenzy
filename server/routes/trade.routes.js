const tradesController = require("../controllers").trades;
const tradeSlotController = require("../controllers").tradeSlots;

const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  // Routes that allow manipulation
  app.post(
    "/api/trade/create",
    [authorizeJwt.verifyToken],
    tradesController.create
  );
  app.post(
    "/api/trade/delete",
    [authorizeJwt.verifyToken],
    tradesController.delete,
    tradeSlotController.deleteQueue
  );
  app.post(
    "/api/trade/join",
    [authorizeJwt.verifyToken],
    tradesController.join,
    tradeSlotController.addUserToQueue
  );
  app.post(
    "/api/trade/leave",
    [authorizeJwt.verifyToken],
    tradesController.leave,
    tradeSlotController.removeUserFromQueue
  );

  // Routes that provide data
  app.get(
    "/api/trade/list",
    [authorizeJwt.verifyToken],
    tradesController.getListOfTrades
  );
  app.get(
    "/api/trade/searchMarket",
    [authorizeJwt.verifyToken],
    tradesController.searchMarket
  );
  app.get(
    "/api/trade/data/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.findById
  );
  app.get(
    "/api/trade/data/queue/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.getBuyerQueue
  );
};
