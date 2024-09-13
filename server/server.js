require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const db = require("./models");
const scheduler = require("./tradeScheduler.js");
const jwt = require("jsonwebtoken");
const config = require("./config/auth.config.js");

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
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Routes
require("./routes/index.js")(app);

// Start listening for requests at a designated port, return server
const httpServer = app.listen(PORT, () => {
  console.log(`Maple Frenzy app listening on port ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  // Verify auth token, trade, and role (buyer or seller)
  const { token } = socket.handshake.auth;
  if(!token){
    console.log("No auth token.");
    socket.disconnect();
  } else {
    jwt.verify(token, config.salt, (error, decoded) => {
      if(error){
        console.log("User disconnected.");
        socket.disconnect();
      }
      console.log("User ID: " + decoded.id);
    });
  }
  
  socket.on("send_message", (data) => {
    console.log(data);
    io.emit("new_message", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

// Start checking for trades that need to be scheduled and displayed to sellers.
const pollingTime = 2000; // 2s
scheduler.start(pollingTime);
