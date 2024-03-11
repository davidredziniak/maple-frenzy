const db = require("../models");
const User = db.users;

// Find user by ID
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
