const User = require("../models").users;

// Checks if the username in the given request already exists
const checkUsernameTaken = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user) return res.status(401).send({ message: "Username already taken." });
    next();
  });
};
module.exports = { checkUsernameTaken };
