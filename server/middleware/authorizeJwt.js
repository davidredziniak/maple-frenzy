const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token)
    return res
      .status(403)
      .send({ error: "No token was found in the headers." });
  jwt.verify(token, config.salt, (error, decoded) => {
    if (error)
      return res.status(401).send({ error: "Access was denied." });
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  verifyToken: verifyToken,
};
