const usersController = require("../controllers").users;
const { authorizeJwt } = require("../middleware");

module.exports = (app) => {
  app.get(
    "/user/:userId",
    [authorizeJwt.verifyToken],
    usersController.findById
  );
  app.post(
    "/user/changepass",
    [authorizeJwt.verifyToken],
    usersController.changePass
  );
  app.get(
    "/usertrades",
    [authorizeJwt.verifyToken],
    usersController.findTradesUserIsIn
  );
};
