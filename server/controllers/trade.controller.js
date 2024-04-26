const db = require("../models");
const Trade = db.trades;
const TradeSlot = db.tradeSlots;
const UserProfile = db.userProfiles;
const User = db.users;
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Get time difference between timeStart and timeEnd in hours
exports.getTimeDifference = (timeStart, timeEnd) => {
  const start = new Date(timeStart);
  const end = new Date(timeEnd);
  let hours = (end - start) / (1000 * 60 * 60);
  return hours;
};

// Create trade
exports.create = (req, res) => {
  // Check if trade start and end time are valid
  let tradeTimeDifference = this.getTimeDifference(
    req.body.timeStart,
    req.body.timeEnd
  );

  // startTime and endTime are the same, or endTime comes before startTime
  if (Math.sign(tradeTimeDifference) <= 0)
    return res
      .status(400)
      .send({ error: "Trade startTime and endTime are invalid." });

  // Check if the time difference are intervals of an hour
  if (tradeTimeDifference % 1 != 0)
    return res.status(400).send({
      error: "The requested trade times have to be in intervals of an hour.",
    });

  // Check if channels list is valid
  if (req.body.channels.some((i) => !Number.isInteger(i) || !(i > 0 && i < 31)))
    return res
      .status(400)
      .send({ error: "The list of channels requested are invalid." });

  // Check if user ID is selling anything currently.
  // One seller/user is assumed to be just serving one set of buyers at a time.
  Trade.findOne({ where: { sellerId: req.userId } }).then((trade) => {
    if (trade) {
      return res
        .status(404)
        .send({ error: "You already have an active trade." });
    } else {
      Trade.create({
        sellerId: req.userId,
        inGameName: req.body.inGameName,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        price: req.body.price,
        channels: req.body.channels,
        buyerLimit: req.body.buyerLimit,
        buyerAvailable: req.body.buyerLimit,
        inProgress: false,
      })
        .then((newTrade) => {
          if (newTrade) {
            return res.status(200).send({
              id: newTrade.id,
              message: "Successfully created trade.",
            });
          } else
            return res.status(400).send({ error: "Unable to create trade" });
        })
        .catch((error) => res.status(400).send(error));
    }
  });
};

// Delete Trade
exports.delete = (req, res, next) => {
  // Get trade by Id
  Trade.findOne({ where: { id: req.body.tradeId } })
    .then((trade) => {
      if (!trade) return res.status(404).send({ error: "Trade not found." });

      // Check if trade is ongoing or ended
      if (trade.inProgress)
        return res.status(400).send({
          error: "You can't delete a trade that is ongoing/completed.",
        });

      // Verify if the user deleting is the seller
      if (req.userId == trade.sellerId) {
        // Delete the trade queue
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
  // Get trade by Id
  Trade.findOne({ where: { id: req.body.tradeId } })
    .then((trade) => {
      if (!trade) return res.status(404).send({ error: "Trade not found." });

      // Check if trade is already ongoing or completed
      if (trade.inProgress)
        return res
          .status(400)
          .send({ error: "You can't join a trade that is ongoing/completed." });

      // Check if user joining is the seller
      if (req.userId == trade.sellerId)
        return res
          .status(400)
          .send({ error: "You can't join a trade that you created." });

      // Check if the trade is full
      if (trade.buyerAvailable == 0)
        return res
          .status(400)
          .send({ error: "The trade queue is already full." });

      // Check if users requested duration is valid
      let duration = req.body.duration;
      let tradeHours = this.getTimeDifference(trade.timeStart, trade.timeEnd);
      if (duration > tradeHours || duration <= 0)
        return res.status(400).send({ error: "Invalid requested duration." });

      // Check if users requested channel is available in the trade
      let channel = req.body.channel;
      if (!trade.channels.includes(channel))
        return res.status(400).send({ error: "Invalid requested channel." });

      // Check if user is already in the trade
      TradeSlot.count({ where: { tradeId: trade.id, userId: req.userId } })
        .then((count) => {
          if (count == 1)
            return res
              .status(400)
              .send({ error: "You already joined this trade." });

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
            // Check if its been an hour since trade
            let now = new Date().toISOString();
            let tradeStart = trade.timeStart;
            let tradeTimeDifference = this.getTimeDifference(
              trade.timeStart,
              now
            );

            if (tradeTimeDifference >= 1.0) {
              // Increment trade count of user
              UserProfile.findOne({ where: { userId: req.userId } }).then(
                (profile) => {
                  UserProfile.update(
                    { tradeCount: profile.tradeCount + 1 },
                    { where: { id: profile.id } }
                  );
                }
              );
            }
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
                  inGameName: record.gameName,
                  duration: record.duration,
                  channel: record.channel,
                  pos: record.queuePos,
                });
              });
              return res.status(200).send({
                id: trade.id,
                sellerId: trade.sellerId,
                timeStart: trade.timeStart,
                timeEnd: trade.timeEnd,
                price: trade.price,
                channels: trade.channels,
                buyerLimit: trade.buyerLimit,
                buyerAvailable: trade.buyerAvailable,
                inProgress: trade.inProgress,
                slots: slots,
              });
            })
            .catch((error) => res.status(400).send(error));
        }
      }
    })
    .catch((error) => res.status(400).send(error));
};

// Get list of users prioritized by subscriber status and queue position.
/* SELECT query doesn't work. This function is not a high priority.
exports.getBuyerQueue = (req, res) => {
  Trade.findOne({ where: { id: req.params.tradeId } })
    .then((trade) => {
      if (!trade) {
        res.status(404).send({ error: "Trade not found." });
      } else {
        // Check if the slots query exists
        if (req.query.slots != "") return res.status(200).send(trade);
        else {
          // Filter slots and return the list of buyers who "won".
          TradeSlot.findAll({
            where: { tradeId: trade.id },
            include: [
              {
                model: User,
                required: true, // we want an inner join for this
                where: { userId: db.Sequelize.col("trade_slots.user_id") },
              },
            ],
            order: [
              ["is_subscribed", "DESC"],
              ["pos", "ASC"],
            ],
            limit: trade.buyerLimit,
          })
            .then((slots) => {
              var buyerQueue = [];
              var pos = 1;
              slots.forEach((record) => {
                buyerQueue.push({
                  userId: record.userId,
                  gameName: record.gameName,
                  channel: record.channel,
                  duration: record.duration,
                  queuePos: pos++,
                });
              });
              return res.status(200).send(buyerQueue);
            })
            .catch((error) => res.status(400).send(error));
        }
      }
    })
    .catch((error) => res.status(400).send(error));
};
*/

// Get full list of trades
exports.getListOfTrades = (req, res) => {
  return Trade.findAll({
    order: [["id", "ASC"]],
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

// Given info from a buyer, is there a trade that matches? If so, give them
// the lowest price that is immediately available ("top of the order book").
// Using Sequelize 6.x raw query to do arithmetic.
exports.searchMarket = (req, res) => {
  const userDuration = req.body.duration;
  const userChannel = req.body.channel;

  db.sequelize
    .query(
      "SELECT * FROM trades WHERE abs(extract(epoch from time_end - time_start)/3600) >= :duration AND (:channel = ANY(channels)) AND buyer_avail > 0 AND in_progress is false ORDER BY price ASC LIMIT 1",
      {
        model: Trade,
        mapToModel: true,
        replacements: { duration: userDuration, channel: userChannel },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .then((trade) => {
      const foundTrade = trade[0];
      if (!foundTrade) {
        return res.status(404).send({
          message: "No available trades fit the criteria.",
        });
      } else {
        // Get seller's information
        // Username
        // Reputation
        // Trade Count
        User.findOne({ where: { id: foundTrade.sellerId } }).then((user) => {
          const username = user.username;

          UserProfile.findOne({ where: { userId: foundTrade.sellerId } }).then(
            (profile) => {
              return res.status(200).send({
                message: "Matching trade(s) found.",
                seller: {
                  id: foundTrade.sellerId,
                  username: username,
                  reputation: profile.reputation,
                  tradeCount: profile.tradeCount,
                },
                trade: {
                  id: foundTrade.id,
                  price: foundTrade.price,
                  timeStart: foundTrade.timeStart,
                  timeEnd: foundTrade.timeEnd,
                },
              });
            }
          );
        });
      }
    })
    .catch((error) => res.status(400).send(error));
};
