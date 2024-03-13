const db = require("../models");
const User = db.users;

// Find user by ID
exports.findById = (req, res) => {
  return User.findOne({ where: { id: req.params.userId } })
    .then((user) => {
      if (!user) res.status(404).send({ error: "User not found." });
      else res.status(200).send(user);
    })
    .catch((error) => res.status(400).send(error));
};
