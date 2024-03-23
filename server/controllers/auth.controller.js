const db = require("../models");
const User = db.users;
const UserProfile = db.userProfiles;
const validatePass = db.validatePass;
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate a JWT using a user's id and bcrypt secret
const createJwt = (user) => {
  return jwt.sign({ id: user.id }, config.salt, {
    expiresIn: 86400,
  });
};

// Signup workflow
// Saves a user to the database with a hashed password + salt
// If successful, returns a response with a JWT used to authorize webpages
exports.signUp = (req, res) => {
  if (validatePass(req.body.password)) {
    return User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      createdAt: new Date().toISOString(),
      lastLoggedIn: new Date().toISOString(),
    })
      .then((newUser) => {
        // Create a profile for the new user
        UserProfile.create({
          userId: newUser.id,
        })
          .then(() => {
            res.status(200).send({
              accessToken: createJwt(newUser),
              message: "Successfully signed up.",
            });
          })
          .catch((error) => res.status(500).send(error));
      })
      .catch((error) => res.status(500).send(error));
  } else {
    return res.status(401).send({ message: "Password provided was invalid." });
  }
};

// Signin workflow
// Validates the request's credientials
// If successful, returns a response with a JWT used to authorize webpages
exports.signIn = (req, res) => {
  if (validatePass(req.body.password)) {
    return User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        // Validate if username exists
        if (!user)
          return res.status(401).send({ message: "Username not found." });

        // Validate if password matches database
        const validPassword = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!validPassword)
          return res.status(401).send({ message: "Password incorrect." });

        // Update lastLoggedIn field
        User.update(
          { lastLoggedIn: new Date().toISOString() },
          { where: { id: user.id } }
        );

        // Authorize user and create JWT
        const token = createJwt(user);
        res
          .status(200)
          .send({ accessToken: token, message: "Successfully signed in." });
      })
      .catch((error) => res.status(500).send(error));
  } else {
    return res.status(401).send({ message: "Password provided was invalid." });
  }
};