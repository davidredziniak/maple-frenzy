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
  app.post("/signin", authController.signIn);
  app.post(
    "/signup",
    [verifySignUp.checkUsernameTaken],
    [verifySignUp.checkEmailTaken],
    authController.signUp
  );
  app.post("/refresh", authController.refreshToken);
  app.get("/email/verify/:id/:token", [verifySignUp.verifyEmailToken]);
};
