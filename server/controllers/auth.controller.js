const User = require("../models").users;
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createJwt = (user) => {
  return jwt.sign({ id: user.id }, config.salt, {
    expiresIn: 86400,
  });
};

// Signup workflow
// Saves a user to the database with a hashed password + salt
// If successful, returns a response with a JWT used to authorize webpages
exports.signUp = (req, res) => {
  return User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((newUser) =>
      res.status(200).send({
        accessToken: createJwt(newUser),
        message: "Successfully signed up.",
      })
    )
    .catch((error) => res.status(500).send(error));
};

// Signin workflow
// Validates the request's credientials
// If successful, returns a response with a JWT used to authorize webpages
exports.signIn = (req, res) => {
  const signInError = {
    accessToken: null,
    message: "An error has occured when logging in.",
  };

  return User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      // Validate username
      if (!user) {
        signInError.message = "Username not found.";
        return res.status(401).send(signInError);
      }

      // Validate password
      const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        signInError.message = "Password incorrect.";
        return res.status(401).send(signInError);
      }

      // Authorize user and create JWT
      const token = createJwt(user);
      res
        .status(200)
        .send({ accessToken: token, message: "Successfully logged in." });
    })
    .catch((error) => res.status(500).send(error));
};
