const { verifySignUp } = require("../middleware");
const authController = require("../controllers").auth;

module.exports = (app) => {
  // Define necessary headers
  app.use((request, response, next) => {
    response.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Routes
  app.post("/api/signin", authController.signIn);
  app.post(
    "/api/signup",
    [verifySignUp.checkUsernameTaken],
    authController.signUp
  );
};