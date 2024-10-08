require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");
const scheduler = require("./tradeScheduler.js");
const sockets = require("./sockets.js");

// Express starts a server and points the app to it
const PORT = process.env.PORT;
const app = express();

// Limit requests to official maple-frenzy website
var corsOptions = {
  origin: "https://maplefrenzy.com",
};

// Reinitialize Database (Development purposes, set to TRUE)
var development = false;

app.use(cors(corsOptions));

// Parse requests of application/json
app.use(express.json());

// Parse requests of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to the database
// Auto recreate database for now (development)
db.sequelize
  .sync({ force: development })
  .then(() => {
    // Logs a message to the console.
    console.log("Synced db.");
  })
  .catch((err) => {
    // Logs error messages.
    console.log("Failed to sync db: " + err.message);
  });

// Routes
require("./routes/index.js")(app);

// Start listening for requests at a designated port, return server
const httpServer = app.listen(PORT, () => {
  // Handles server startup completion.
  console.log(`Maple Frenzy app listening on port ${PORT}`);
});

// Socket server
sockets.startSocketServer(httpServer);

// Start checking for trades that need to be scheduled and displayed to sellers.
const pollingTime = 2000; // 2s
scheduler.start(pollingTime);
