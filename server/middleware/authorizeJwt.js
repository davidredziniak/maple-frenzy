const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

// Verify access token in header
function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token)
    return res
      .status(403)
      .send({ error: "No token was found in the headers." });
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error) return res.status(403).send({ error: "Access token was denied." });
    req.userId = decoded.id;
    next();
  });
}

// Verify if the provided refresh token matches a userId
function verifyRefresh(userId, token) {
  try {
    const decoded = jwt.verify(token, config.salt);
    return userId === decoded.id;
  } catch (error) {
    return false;
  }
}

module.exports = {
  verifyToken: verifyToken,
  verifyRefresh: verifyRefresh,
};
