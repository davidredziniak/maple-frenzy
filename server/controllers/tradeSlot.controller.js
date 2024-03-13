const db = require("../models");
const TradeSlot = db.tradeSlots;
const Trade = db.trades;

// Get the next queue position
exports.getNextPos = (trade) => {
  let nextPos = trade.buyerLimit - trade.buyerAvailable + 1;
  if (nextPos > 0 && nextPos <= trade.buyerLimit) return nextPos;
  return null;
};

// Decrement the amount of available slots
exports.decrementAvail = (trade) => {
  return Trade.update(
    { buyerAvailable: trade.buyerAvailable - 1 },
    { where: { id: trade.id } }
  );
};

// Add a user to the queue
exports.addUserToQueue = (req, res) => {
  // Retrieve an available position in the trade
  let pos = this.getNextPos(req.trade);
  if (pos == null)
    return res
      .status(400)
      .send({ error: "Error retrieving new queue position. " });

  // Create a new trade slot for the joining user
  TradeSlot.create({
    tradeId: req.trade.id,
    userId: req.userId,
    queuePos: pos,
  })
    .then(() => {
      // Decrement the amount of available slots on the trade
      this.decrementAvail(req.trade)
        .then((update) => {
          return res
            .status(200)
            .send({ message: "Successfully joined the trade." });
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};
