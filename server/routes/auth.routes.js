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

async function registerUser(credentials) {
  return fetch('https://maple-frenzy.onrender.com/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: { username: (username), password: (password)}
  })
    .then(response => response.json())
 }

