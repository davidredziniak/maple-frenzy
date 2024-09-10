const db = require("../models");
const User = db.users;
const UserProfile = db.userProfiles;
const EmailToken = db.emailTokens;
const { verifyRefresh } = require("../middleware").authorizeJwt;
const { generateAndSendEmailToken } = require("../middleware").verifySignUp;
const config = require("../config/auth.config.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate an access JWT that is short lived using a user's id and bcrypt secret
const createAccessJwt = (userId) => {
  return jwt.sign({ id: userId }, config.salt, {
    expiresIn: 86400, // 1 day access
  });
};

// Generate a refresh JWT that will be able to refresh an access token using a user's id and bcrypt secret
const createRefreshJwt = (userId) => {
  return jwt.sign({ id: userId }, config.salt, {
    expiresIn: 2592000, // 30 day access
  });
};

// Create a new access and refresh JWT given a userId and valid refreshToken, in order to persist user login
exports.refreshToken = (req, res) => {
  const { userId, refreshToken } = req.body;
  const isValid = verifyRefresh(userId, refreshToken);
  if (!isValid)
    return res
      .status(401)
      .send({ message: "Invalid token provided. Please sign in again." });
  else {
    res.status(200).send({
      accessToken: createAccessJwt(userId),
      refreshToken: createRefreshJwt(userId),
      message: "Successfully refreshed tokens.",
    });
  }
};

// Validate password constraints
const validatePass = (pass) => {
  // For now, just require 8 chars as minimum length
  // Require more thorough validation through frontend
  if (typeof pass !== "string" || pass.length < 8) return false;
  return true;
};

// Validate email constraints
const validateEmail = (email) => {
  // Require more thorough validation through frontend
  var regex = /\S+@\S+\.\S+/;
  if (typeof email !== "string") return false;
  return regex.test(email);
};

// Signup workflow
// Saves a user to the database with a hashed password + salt
// If successful, returns a response with a JWT used to authorize webpages
exports.signUp = (req, res) => {
  if (!validateEmail(req.body.email))
    return res.status(401).send({ message: "Email provided was invalid." });

  if (validatePass(req.body.password)) {
    let username = req.body.username.toLowerCase();
    return User.create({
      username: username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      createdAt: new Date().toISOString(),
      lastLoggedIn: new Date().toISOString(),
    })
      .then((newUser) => {
        // Create a profile for the new user
        UserProfile.create({
          userId: newUser.id,
        })
          .then(async () => {
            // Successful signup
            // Send out an email to verify link
            await generateAndSendEmailToken(newUser);

            res.status(200).send({
              message:
                "Successfully signed up. Please verify account by clicking the link in the email.",
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
    let username = req.body.username.toLowerCase();
    return User.findOne({ where: { username: username } })
      .then(async (user) => {
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

        // Check if user's email is verified
        if (!user.isVerified) {
          await generateAndSendEmailToken(user);
          return res.status(401).send({
            message:
              "Please complete verification by clicking the link sent to the email.",
          });
        }

        // Update lastLoggedIn field
        User.update(
          { lastLoggedIn: new Date().toISOString() },
          { where: { id: user.id } }
        );

        // Authorize user and create JWT
        res.status(200).send({
          userId: user.id,
          accessToken: createAccessJwt(user.id),
          refreshToken: createRefreshJwt(user.id),
          message: "Successfully signed in.",
        });
      })
      .catch((error) => res.status(500).send(error));
  } else {
    return res.status(401).send({ message: "Password provided was invalid." });
  }
};
