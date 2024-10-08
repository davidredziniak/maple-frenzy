const User = require("../models").users;
const EmailToken = require("../models").emailTokens;
const emailTransponder = require("./emailTransponder");
const emailConfig = require("../config/email.config.js");
const crypto = require("crypto");

// Checks if the username in the given request already exists
const checkUsernameTaken = (req, res, next) => {
  let username = req.body.username.toLowerCase();
  User.findOne({ where: { username: username } }).then((user) => {
    if (user)
      return res.status(401).send({ message: "Username already taken." });
    next();
  });
};

// Checks if the email in the given request already exists
const checkEmailTaken = (req, res, next) => {
  let email = req.body.email.toLowerCase();
  User.findOne({ where: { email: email } }).then((user) => {
    if (user) return res.status(401).send({ message: "Email already taken." });
    next();
  });
};

async function generateAndSendEmailToken(user) {
  // Check if email token already exists
  EmailToken.findOne({ where: { userId: user.id } }).then((token) => {
    if (token) {
      EmailToken.update(
        { token: crypto.randomBytes(16).toString("hex") },
        { where: { userId: user.id } }
      ).then(() => {
        sendEmailToken(user);
      });
    } else {
      EmailToken.create({
        userId: user.id,
        token: crypto.randomBytes(16).toString("hex"),
      }).then(() => {
        sendEmailToken(user);
      });
    }
  });
}

// Send the current email token in the database to the user's email
async function sendEmailToken(user) {
  EmailToken.findOne({ where: { userId: user.id } }).then((token) => {
    if (token) {
      emailTransponder.sendMail({
        to: `${user.email}`,
        subject: "Maple Frenzy - Account Verification",
        text:
          `Welcome to Maple Frenzy, ${user.username}.
    Please verify your email by clicking this link:
    https://` +
          emailConfig.EMAIL_LINK +
          `/email/verify/${user.id}/${token.token}`,
      });
    }
  });
}

// Checks if the token and userID in the request is valid
// If it is, verify the user and allow future sign in
// If it isn't, tell the user to request a new token to their email.
function verifyEmailToken(req, res) {
  // Check request parameters for user ID
  let userId = req.params.id;
  if (!userId)
    return res
      .status(403)
      .send({ error: "No id was found in the URL parameters." });

  // Check request parameters for token string
  let token = req.params.token;
  if (!token)
    return res
      .status(403)
      .send({ error: "No token was found in the URL parameters." });

  // Locate if userId and token string is in the database
  EmailToken.findOne({ where: { userId: userId, token: token } }).then(
    (token) => {
      if (!token)
        return res.status(401).send({
          message:
            "Your verification link may have expired. Please sign in again to receive a new verification email.",
        });

      User.findOne({ where: { id: userId } }).then((user) => {
        if (!user)
          return res.status(401).send({
            message: "Unable to find a user. Please try signing up again.",
          });
        else if (user.isVerified) {
          // User is already verified
          return res
            .status(200)
            .send({ message: "User is already verified. Please sign in." });
        } else {
          // Update User to email verified
          User.update({ isVerified: true }, { where: { id: user.id } });

          // Delete email token from the database
          EmailToken.destroy({
            where: {
              id: token.id,
            },
          });

          // Successful email verification
          return res
            .status(200)
            .send(
              "Your account has been successfully verified. You can now sign in."
            );
        }
      });
    }
  );
}

module.exports = {
  checkUsernameTaken,
  checkEmailTaken,
  verifyEmailToken,
  generateAndSendEmailToken,
  sendEmailToken,
};
