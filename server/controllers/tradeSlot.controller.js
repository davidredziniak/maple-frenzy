const db = require("../models");
const TradeSlot = db.tradeSlots;
const Trade = db.trades;

// Get the next queue position
exports.getNextPos = (trade) => {
  let nextPos = trade.buyerLimit - trade.buyerAvailable + 1;
  if (nextPos <= trade.buyerLimit) return nextPos;
  return 0;
};

// Decrement the amount of available slots
exports.decrementAvail = (trade) => {
  return Trade.update(
    { buyerAvailable: trade.buyerAvailable - 1 },
    { where: { id: trade.id } }
  );
};

// Increment the amount of available slots
exports.incrementAvail = (trade) => {
  return Trade.update(
    { buyerAvailable: trade.buyerAvailable + 1 },
    { where: { id: trade.id } }
  );
};

// Add a user to the queue
exports.addUserToQueue = (req, res) => {
  // Retrieve an available position in the trade
  let pos = this.getNextPos(req.trade);
  if (pos == 0)
    return res
      .status(400)
      .send({ error: "Error retrieving new queue position. " });

  // Create a new trade slot for the joining user
  TradeSlot.create({
    tradeId: req.trade.id,
    userId: req.userId,
    gameName: req.body.gameName,
    channel: req.body.channel,
    duration: req.body.duration,
    queuePos: pos,
  })
    .then(() => {
      // Update the amount of available positions in the trade
      this.decrementAvail(req.trade)
        .then(() => {
          return res
            .status(200)
            .send({ message: "Successfully joined the trade.", queuePos: pos });
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

// Remove a user from the queue
exports.removeUserFromQueue = (req, res) => {
  return TradeSlot.findOne({
    where: { tradeId: req.trade.id, userId: req.userId },
  })
    .then((tradeSlot) => {
      if (!tradeSlot)
        return res.status(404).send({ error: "User not found in the trade." });

      // Get user position
      let userPos = tradeSlot.queuePos;

      // Remove record of user from queue
      tradeSlot.destroy();

      // Find all user records that have are positioned after the removed user
      TradeSlot.findAll({
        where: {
          tradeId: req.trade.id,
          queuePos: {
            [db.Sequelize.Op.gte]: userPos,
          },
        },
      })
        .then((result) => {
          // Shift each record to a higher queue priority
          result.forEach((record) => {
            TradeSlot.update(
              { queuePos: record.queuePos - 1 },
              { where: { id: record.id } }
            );
          });

          // Update the amount of available positions in the trade
          this.incrementAvail(req.trade)
            .then(() => {
              return res
                .status(200)
                .send({ message: "Successfully left the trade." });
            })
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

exports.deleteQueue = (req, res) => {
  TradeSlot.findAll({
    where: {
      tradeId: req.trade.id,
    },
  })
    .then((result) => {
      // Delete the queue if it is populated
      result.forEach((record) => {
        record.destroy();
      });

      // Delete the trade
      req.trade.destroy();
      return res
        .status(200)
        .send({ message: "Successfully deleted the trade." });
    })
    .catch((error) => res.status(400).send(error));
};
