const db = require("../models");
const Trade = db.trades;
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function verifyToken(request, response, next) {
  let token = request.headers["x-access-token"];
  if (!token)
    return response
      .status(403)
      .send({ error: "No token was found in the headers." });
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error)
      return response.status(401).send({ error: "Access was denied." });
    request.userId = decoded.id;
    next();
  });
}

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
      res.status(200).send(newTrade);
    })
    .catch((error) => res.status(500).send(error));
};

// Find trade by ID
exports.findById = (request, response) => {
  return Trade.findOne({ where: { id: request.params.tradeId } })
    .then((trade) => {
      if (!trade) {
        response.status(404).send({ error: "Trade not found." });
      } else {
        response.status(200).send(trade);
      }
    })
    .catch((error) => response.status(400).send(error));
};
