const usersController = require("../controllers").users;
const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  app.get(
    "/api/users/:userId",
    [authorizeJwt.verifyToken],
    usersController.findById
  );
};
