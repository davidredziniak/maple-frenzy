const db = require("../models");
const User = db.users;
const UserProfile = db.userProfiles;
const Trade = db.trades;
const TradeSlot = db.tradeSlots;
const validatePass = require("./auth.controller.js").validatePass;
const config = require("../config/auth.config.js");
const bcrypt = require("bcryptjs");

// Find user by ID
exports.findById = (req, res) => {
  return User.findOne({ where: { id: req.params.userId } })
    .then((user) => {
      if (!user) return res.status(404).send({ error: "User not found." });

      // Get user profile (trade count and reputation)
      UserProfile.findOne({ where: { userId: req.params.userId } })
        .then((userProfile) => {
          if (!userProfile)
            return res.status(404).send({ error: "User profile not found." });

          return res.status(200).send({
            id: user.id,
            username: user.username,
            tradeCount: userProfile.tradeCount,
            reputation: userProfile.reputation,
            createdAt: user.createdAt,
            lastLoggedIn: user.lastLoggedIn,
          });
        })
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
};

// Get time difference between timeStart and timeEnd in hours
exports.getTimeDifference = (timeStart, timeEnd) => {
  const start = new Date(timeStart);
  const end = new Date(timeEnd);
  let hours = (end - start) / (1000 * 60 * 60);
  return hours;
};

exports.findTradesUserIsIn = async function (req, res) {
  let joined = [];
  let created = [];

  // Fetch joined trades
  const joinedTrades = await TradeSlot.findAll({
    where: { userId: req.userId },
  });

  // Map joinedTrades to an array of promises to fetch each trade
  const joinedPromises = joinedTrades.map(async (record) => {
    const foundTrade = await Trade.findOne({ where: { id: record.tradeId } });
    if (foundTrade) {
      joined.push({
        id: record.tradeId,
        gameName: record.gameName,
        channel: record.channel,
        duration: record.duration,
        timeStart: foundTrade.timeStart,
        inProgress: foundTrade.inProgress,
      });
    }
  });

  // Wait for all promises to complete
  await Promise.all(joinedPromises);

  // Fetch created trades
  const createdTrades = await Trade.findAll({
    where: { sellerId: req.userId },
  });

  // Map createdTrades to an array of data objects
  createdTrades.forEach((record) => {
    created.push({
      id: record.id,
      timeStart: record.timeStart,
      duration: this.getTimeDifference(record.timeStart, record.timeEnd),
      current: record.buyerLimit - record.buyerAvailable,
      limit: record.buyerLimit,
      inProgress: record.inProgress,
    });
  });

  return res.status(200).send({
    joined,
    created,
  });
};

// Change user password
exports.changePass = (req, res) => {
  // Check current password and new password
  if (validatePass(req.body.password) && validatePass(req.body.newPassword)) {
    return User.findOne({ where: { id: req.userId } })
      .then((user) => {
        if (!user) return res.status(404).send({ error: "User not found." });

        // Check if the current password matches the database
        const validPassword = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!validPassword)
          return res
            .status(401)
            .send({ message: "Current password provided is incorrect." });

        // Update the password with the new one
        const updatedPass = bcrypt.hashSync(req.body.newPassword, 8);
        User.update({ password: updatedPass }, { where: { id: user.id } }).then(
          () => {
            return res
              .status(200)
              .send({ message: "Successfully updated password!" });
          }
        );
      })
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(401).send({ message: "Password provided was invalid." });
  }
};
