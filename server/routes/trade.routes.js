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
    "/api/trades/delete",
    [authorizeJwt.verifyToken],
    tradesController.delete, tradeSlotController.deleteQueue
  );
  app.post(
    "/api/trades/join",
    [authorizeJwt.verifyToken],
    tradesController.join,
    tradeSlotController.addUserToQueue
  );
  app.post(
    "/api/trades/leave",
    [authorizeJwt.verifyToken],
    tradesController.leave,
    tradeSlotController.removeUserFromQueue
  );
  app.get(
    "/api/trades/data/:tradeId",
    [authorizeJwt.verifyToken],
    tradesController.findById
  );
};
