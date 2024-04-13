require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");
const scheduler = require("./tradeScheduler.js");

const PORT = process.env.PORT;
const app = express();

// Limit requests to official maple-frenzy website
var corsOptions = {
  origin: "https://maple-frenzy-site.onrender.com",
};

// Reinitialize Database (Development purposes, set to TRUE)
var development = true;

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
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Routes
require("./routes/index.js")(app);

// Start listening for requests at a designated port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Start checking for trades that need to be scheduled and displayed to sellers.
const pollingTime = 2000; // 2s
scheduler.start(pollingTime);
