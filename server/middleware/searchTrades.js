const db = require("../models");
const Trade = db.trades;
const User = db.users;

// Given info from a buyer, is there a trade that matches? If so, give them
// the lowest price that is immediately available ("top of the order book").
// Using Sequelize 6.x raw query to do arithmetic.
async function searchTrades(req, res) {
  const userDuration = req.body.duration;
  const userChannel = re.body.channel;

  await db.Sequelize.query(
    'SELECT * FROM trades WHERE (timeEnd - timeStart >= :duration) AND (:channel = ANY(channels)) ORDER BY price ASC LIMIT 1', {
      model: Trade,
      mapToModel: true,
      replacements: { duration: userDuration, channel: userChannel },
      type: QueryTypes.SELECT,
    }).then(
      (trade) => {
        if (!trade) {
          return res.status(404).send({
            error: "No available trades fit the criteria."
          });
        } else {
          res.status(200).send("Matching trade(s) found.");
          return trade.tradeId;  
        }
      })
      .catch((error) => res.status(400).send(error));
};

module.exports = { searchTrades };
