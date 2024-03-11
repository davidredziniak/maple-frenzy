const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = async (req, res) => {
  console.log(req.body);

  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Username or password cannot be empty!",
    });
    return;
  }

  // Check if user exists in the database
  const username = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  // User exists
  if (username) {
    return res.status(500).send({
      message: "Username already exists.",
    });
  }

  // Create a new User
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};
