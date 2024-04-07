const db = require("../models");
const User = db.users;
const UserProfile = db.userProfiles;
const validatePass = db.validatePass;
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
