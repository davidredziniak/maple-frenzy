const db = require("../models");
const User = db.users;
const UserProfile = db.userProfiles;
const { verifyRefresh } = require("../middleware").authorizeJwt;
const { generateAndSendEmailToken } = require("../middleware").verifySignUp;
const config = require("../config/auth.config.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * @description Generates a JSON Web Token (JWT) that contains a user's ID and is
 * signed with a secret key from the `config.salt` variable, valid for one day. It
 * returns the generated JWT.
 *
 * @param {number} userId - Used as identifier for user.
 *
 * @returns {string} A JSON Web Token (JWT) that contains the user's ID and expires
 * in one day.
 */
const createAccessJwt = (userId) => {
  return jwt.sign({ id: userId }, config.salt, {
    expiresIn: 86400, // 1 day access
  });
};

/**
 * @description Generates a JSON Web Token (JWT) for refresh authentication, using a
 * given user ID and a secret salt. The token is set to expire after 30 days, allowing
 * users to obtain a new access token without re-authenticating.
 *
 * @param {number} userId - Required for generating a JWT token.
 *
 * @returns {string} A JSON Web Token (JWT) containing user identification and
 * configured to expire after 30 days.
 */
const createRefreshJwt = (userId) => {
  return jwt.sign({ id: userId }, config.salt, {
    expiresIn: 2592000, // 30 day access
  });
};

/**
 * @description Validates a refresh token sent with a request, checks its validity
 * using the `verifyRefresh` function, and if valid, generates new access and refresh
 * tokens for the associated user.
 *
 * @param {Express.Request} req - Used to receive data from the client.
 *
 * @param {Response} res - Used for returning HTTP responses to clients.
 *
 * @returns {any} An object containing three properties: `accessToken`, `refreshToken`,
 * and `message`. The `accessToken` and `refreshToken` are strings representing JWT
 * tokens, and the `message` property is a string indicating successful token refresh.
 */
const refreshToken = (req, res) => {
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

/**
 * @description Verifies whether a given password is valid by checking two conditions:
 * its type and length. It checks if the input is a string and has at least 8 characters;
 * otherwise, it returns false; else, it returns true.
 *
 * @param {string} pass - 8 characters or more.
 *
 * @returns {boolean} `true` if the input is valid and `false` otherwise.
 */
const validatePass = (pass) => {
  // For now, just require 8 chars as minimum length
  // Require more thorough validation through frontend
  if (typeof pass !== "string" || pass.length < 8) return false;
  return true;
};

/**
 * @description Checks if a given string is a valid email address. It uses a regular
 * expression to match the email format, and also verifies that the input is a string.
 * If either condition fails, it returns `false`. Otherwise, it returns `true`.
 *
 * @param {string} email - Required for validation.
 *
 * @returns {boolean} True if the input matches the regular expression pattern and
 * false otherwise.
 */
const validateEmail = (email) => {
  // Require more thorough validation through frontend
  var regex = /\S+@\S+\.\S+/;
  if (typeof email !== "string") return false;
  return regex.test(email);
};

// Signup workflow
// Saves a user to the database with a hashed password + salt
/**
 * @description Validates user input, creates a new user account with hashed password
 * and a corresponding profile, generates an email token for verification, and sends
 * an email to the user's registered email address. It handles errors and returns
 * status codes accordingly.
 *
 * @param {Request | any} req - An object that holds HTTP request data.
 *
 * @param {object} res - Used for sending HTTP responses.
 *
 * @returns {Promise<void>} 200 (in case of successful signup) or an error object
 * with a 401 or 500 status code.
 */
const signUp = (req, res) => {
  if (!validateEmail(req.body.email))
    return res.status(401).send({ message: "Email provided was invalid." });

  if (validatePass(req.body.password)) {
    let username = req.body.username.toLowerCase();
    let email = req.body.email.toLowerCase();
    return User.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(req.body.password, 8),
      createdAt: new Date().toISOString(),
      lastLoggedIn: new Date().toISOString(),
    })
      .then((newUser) => {
        // Creates user profile.
        UserProfile.create({
          userId: newUser.id,
        })
          .then(async () => {
            // Handles successful user sign-up.
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
/**
 * @description Handles user authentication, verifying a username and password against
 * stored data. If credentials are valid, it generates tokens and updates the last
 * logged-in timestamp, returning an authorization response with access and refresh
 * tokens.
 *
 * @param {express.Request} req - Used to represent HTTP request.
 *
 * @param {object} res - Used to return an HTTP response.
 *
 * @returns {object} Either an authorization token object with user ID, access token,
 * refresh token and a success message if validation is successful or an error response
 * containing the status code, message and/or error details in case of failure.
 */
const signIn = (req, res) => {
  if (validatePass(req.body.password)) {
    let username = req.body.username.toLowerCase();
    return User.findOne({ where: { username: username } })
      .then(async (user) => {
        // Handles user authentication logic.
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

module.exports = { signIn, signUp, refreshToken, validatePass }