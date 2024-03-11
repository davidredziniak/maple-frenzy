const User = require("../models").users;

// Checks if the username in the given request already exists
const checkUsernameTaken = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user) {
      res.status(400).send({ error: "Username already taken." });
      return;
    }
    next();
  });
};
module.exports = { checkUsernameTaken };
