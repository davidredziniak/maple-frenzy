const db = require("../models");
const Trade = db.trades;
const TradeSlot = db.tradeSlots;

const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create trade
exports.create = (req, res) => {
  // Retrieve user id from JWT
  let token = req.headers["x-access-token"];
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error)
      return response.status(401).send({ error: "Access was denied." });
    req.userId = decoded.id;
  });

  return Trade.create({
    sellerId: req.userId,
    timeStart: new Date().toISOString(),
    timeEnd: new Date().toISOString(),
    price: req.body.price,
    region: req.body.region,
    buyerLimit: req.body.buyerLimit,
    buyerAvailable: req.body.buyerLimit,
  })
    .then((newTrade) => {
      res
        .status(200)
        .send({ id: newTrade.id, message: "Successfully created trade." });
    })
    .catch((error) => res.status(400).send(error));
};

// Delete Trade
exports.delete = (req, res, next) => {
  // Retrieve user id from JWT
  let token = req.headers["x-access-token"];
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error)
      return response.status(401).send({ error: "Access was denied." });
    req.userId = decoded.id;
  });

  // Get trade by Id
  Trade.findOne({ where: { id: req.body.tradeId } })
    .then((trade) => {
      if (!trade) return res.status(404).send({ error: "Trade not found." });

      // Verify if the user deleting is the seller
      if (req.userId == trade.sellerId) {
        // Delete the queue
        req.trade = trade;
        next();
      } else {
        return res
          .status(401)
          .send({ error: "You are unauthorized to delete this trade." });
      }
    })
    .catch((error) => res.status(400).send(error));
};

// Join Trade
exports.join = (req, res, next) => {
  // Retrieve user id from JWT
  let token = req.headers["x-access-token"];
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error) return res.status(401).send({ error: "Access was denied." });
    req.userId = decoded.id;
  });

  // Get trade by Id
  Trade.findOne({ where: { id: req.body.tradeId } })
    .then((trade) => {
      if (!trade) return res.status(404).send({ error: "Trade not found." });

      // Check if user joining is the seller
      if (req.userId == trade.sellerId)
        return res
          .status(400)
          .send({ error: "You can't join a trade that you created." });

      // Check if user is already in the trade
      TradeSlot.count({ where: { tradeId: trade.id, userId: req.userId } })
        .then((count) => {
          if (count == 1)
            return res
              .status(400)
              .send({ error: "You already joined this trade." });

          // Check if the trade is full
          if (trade.buyerAvailable == 0)
            return res
              .status(400)
              .send({ error: "The trade queue is already full." });

          // Add user to the queue
          req.trade = trade;
          next();
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

// Leave Trade
exports.leave = (req, res, next) => {
  // Retrieve user id from JWT
  let token = req.headers["x-access-token"];
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error) return res.status(401).send({ error: "Access was denied." });
    req.userId = decoded.id;
  });

  // Get trade by Id
  Trade.findOne({ where: { id: req.body.tradeId } })
    .then((trade) => {
      if (!trade) return res.status(404).send({ error: "Trade not found." });

      // Check if user leaving is the seller
      if (req.userId == trade.sellerId)
        return res
          .status(400)
          .send({ error: "You can't leave a trade that you created." });

      // Check if user is already in the trade
      TradeSlot.count({ where: { tradeId: trade.id, userId: req.userId } })
        .then((count) => {
          if (count == 1) {
            // Remove user from the queue
            req.trade = trade;
            next();
          } else
            return res
              .status(400)
              .send({ error: "You are not in this trade." });
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

// Find trade by ID
exports.findById = (req, res) => {
  return Trade.findOne({ where: { id: req.params.tradeId } })
    .then((trade) => {
      if (!trade) {
        res.status(404).send({ error: "Trade not found." });
      } else {
        // Check if the slots query exists
        if (req.query.slots != "") return res.status(200).send(trade);
        else {
          // Check if user requesting slot data is not the owner of the trade
          if (req.userId != trade.sellerId)
            return res.status(401).send({
              error: "You are not authorized to view the slots of this trade.",
            });

          // Return trading data including the slots in ascending position order
          TradeSlot.findAll({
            where: { tradeId: trade.id },
            order: [["pos", "ASC"]],
          })
            .then((result) => {
              var slots = [];
              result.forEach((record) => {
                slots.push({
                  userId: record.userId,
                  pos: record.queuePos,
                });
              });
              return res.status(200).send({
                id: trade.id,
                sellerId: trade.sellerId,
                timeStart: trade.timeStart,
                timeEnd: trade.timeEnd,
                price: trade.price,
                region: trade.region,
                buyerLimit: trade.buyerLimit,
                buyerAvailable: trade.buyerAvailable,
                slots: slots,
              });
            })
            .catch((error) => res.status(400).send(error));
        }
      }
    })
    .catch((error) => res.status(400).send(error));
};

// Get full list of trades
exports.getListOfTrades = (req, res) => {
  return Trade.findAll({
    where: { id: 30 }, order: [["id", "ASC"]],
  })
    .then((result) => {
      var trades = [];
      result.forEach((record) => {
        trades.push(record);
      });
      res.status(200).send({ trades: trades });
    })
    .catch((error) => res.status(400).send(error));
};
