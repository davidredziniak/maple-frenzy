const tradesController = require("../controllers").trades;
const tradeSlotController = require("../controllers").tradeSlots;

const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  // Routes that allow manipulation
  app.post(
    "/trade/create",
    [authorizeJwt.verifyToken],
    tradesController.create
  );
  app.post(
    "/trade/delete",
    [authorizeJwt.verifyToken],
    tradesController.delete,
    tradeSlotController.deleteQueue
  );
  app.post(
    "/trade/join",
    [authorizeJwt.verifyToken],
    tradesController.join,
    tradeSlotController.addUserToQueue
  );
  app.post(
    "/trade/leave",
    [authorizeJwt.verifyToken],
    tradesController.leave,
    tradeSlotController.removeUserFromQueue
  );
  app.post(
    "/trade/searchmarket",
    [authorizeJwt.verifyToken],
    tradesController.searchMarket
  );
  
  // Routes that provide data
  app.get(
    "/trade/list",
    [authorizeJwt.verifyToken],
    tradesController.getListOfTrades
  );
  app.get(
    "/trade/data/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.findById
  );
  /*
  app.get(
    "/trade/data/queue/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.getBuyerQueue
  );
  */
  app.get(
    "/trade/viewslot/:tradeId",
    [authorizeJwt.verifyToken],
    tradeSlotController.findSlotOfUser
  );
};
