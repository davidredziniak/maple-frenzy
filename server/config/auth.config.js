require("dotenv").config();

module.exports = {
  salt: process.env.AUTH_SALT,
};
