const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate if any crediential fields are empty
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Username or password cannot be empty!",
    });
    return;
  }

  // Create a user in the database
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  
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

exports.show = (request, response) => {
  return User.findByPk(request.params.userId, userSerializationOptions)
    .then((user) => {
      if (!user) {
        response.status(404).send({ error: "User not found" });
      } else {
        response.status(200).send(user);
      }
    })
    .catch((error) => response.status(400).send(error));
};
